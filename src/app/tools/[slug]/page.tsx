import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  FileUser,
  MessageCircle,
  ReceiptText,
  QrCode
} from "lucide-react";
import { getTool, tools } from "@/lib/tools";
import ToolWorkbench from "@/components/ToolWorkbench";
import promo from "@/config/ads.json";

const iconMap = {
  image: ImageIcon,
  "file-user": FileUser,
  "message-circle": MessageCircle,
  receipt: ReceiptText,
  "qr-code": QrCode
} as const;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  return tool ? { title: tool.seoTitle, description: tool.description } : {};
}

const faqs: Record<string, { q: string; a: string }[]> = {
  "whatsapp-link-generator": [
    {
      q: "How do I create a WhatsApp link with my Nigerian number?",
      a: "Enter your number with the country code or as a local Nigerian number. The generator formats it into an international wa.me link."
    },
    {
      q: "Can I add a message to my WhatsApp link?",
      a: "Yes. Add an optional message and it will be URL-encoded into the link."
    },
    {
      q: "Is the WhatsApp link free?",
      a: "Yes. Creating and copying your link is free. You do not need to sign up."
    }
  ],
  "qr-code-generator": [
    {
      q: "What can I put in a QR code?",
      a: "You can create a QR code from a website link, contact page, menu URL or short text."
    },
    {
      q: "Can I download my QR code?",
      a: "Yes. Generate your code and download it as a PNG image."
    },
    {
      q: "Does a QR code expire?",
      a: "A QR code made from a fixed link does not expire by itself. It works while the destination remains available."
    }
  ],
  "image-compressor": [
    {
      q: "Can I compress an image to 200KB for JAMB or NYSC?",
      a: "Set a target size of 200KB and adjust quality. Whether an image reaches that size depends on its dimensions, format and content."
    },
    {
      q: "Will compression reduce quality?",
      a: "Compression can reduce image quality. Preview the result and adjust quality before downloading."
    },
    {
      q: "Are my images uploaded?",
      a: "Image processing happens in your browser in this version. Your selected image is not sent to our server."
    }
  ],
  "invoice-generator": [
    {
      q: "Can I create an invoice in naira?",
      a: "Yes. The invoice tool uses Nigerian naira (₦) and lets you enter business and customer details."
    },
    {
      q: "Can I download an invoice as PDF?",
      a: "Yes. Generate an invoice PDF with selectable text."
    },
    {
      q: "Do I need an account?",
      a: "No account is required to create and download a basic invoice."
    }
  ],
  "cv-generator": [
    {
      q: "Is this CV generator ATS-friendly?",
      a: "It provides a simple single-column layout with standard headings and selectable text. ATS platforms differ, so no layout can guarantee acceptance."
    },
    {
      q: "Can I download my CV as PDF?",
      a: "Yes. The generated PDF uses selectable text rather than a screenshot."
    },
    {
      q: "Does the ATS checker guarantee a pass?",
      a: "No. It is a basic formatting preflight, not a scan by an employer&apos;s ATS."
    }
  ]
};

export default async function ToolPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Icon = iconMap[tool.icon];

  return (
    <main className="page-wrap">
      <Link href="/#tools" className="back-link">
        <ArrowLeft
          size={14}
          style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }}
        />
        All tools
      </Link>

      <div className="tool-head">
        <div className={`tool-icon tone-${tool.tone}`}>
          <Icon size={23} />
        </div>
        <h1>{tool.seoTitle}</h1>
        <p>{tool.tagline}</p>
      </div>

      <div className="ad-slot">ADVERTISEMENT</div>
      <ToolWorkbench slug={tool.slug} />
      <div className="ad-slot">ADVERTISEMENT</div>

      <div className="promo">
        <div>
          <strong>{promo.headline}</strong>
          <p>{promo.description}</p>
        </div>
        <Link href={promo.link}>{promo.ctaText} ↗</Link>
      </div>

      <div className="ad-slot">ADVERTISEMENT</div>

      <section className="faq">
        <h2>Frequently asked questions</h2>
        {faqs[slug]?.map((faq) => (
          <div className="faq-item" key={faq.q}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AboutCard(props: {title: string, description: string}) {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal prose"> 
          <p className="mb-3">A simplified Next.js AI starter kit designed with simplicity and speed in mind.</p>
          <p className="mb-3">Built with Next.js, AI SDK, Tailwind, Typescript and shadcn you can build a bare minimum AI Chatbot with only an environment variable. Based off the popular <Link href="https://chat.vercel.ai/">Next AI Chatbot</Link> the aim for this project is to remove any dependency outside of basic functionality and examples with an emphasis on making changes and experimenting with the AI SDK. </p>
          <p className="mb-3 font-semibold">Big Opinions:</p>
          <ul className="flex flex-col mb-2">
            <li>→ Speed to learning and experimenting AI SDK</li>
            <li>→ App Router, Server Actions, React Server Components</li>
            <li>→ No auth, storage or sharing</li>
            <li></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

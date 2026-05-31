import { Metadata } from "next";
import ModeBitsClient from "./ModeBitsClient";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "stat(2) Visualizer / Sanchit Sahay",
		description: "Interactive Linux/Unix stat(2) mode bit visualizer for decoding file types, permissions, and special flags.",
	};
}

export default function ModeBitsPage() {
	return <ModeBitsClient />;
}

"use client";
import { Lottie } from "lottie-react";

export default function Home() {
  return (
    <div>
      <Lottie src={"assets/groovyWalk.json"} initialValues={{ autoplay: true, loop: true }} />
    </div>
  );
}

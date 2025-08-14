import { useState, useEffect, useRef } from "react";

export default function TypingEffect({
  texts = ["Hello, World!", "Welcome to our site!", "Start Your Journey!"],
  speed = 200,
  eraseSpeed = 100,
  delay = 1500,
}: {
  texts: string[];
  speed?: number;
  eraseSpeed?: number;
  delay?: number;
}) {
  const [wordLength, setWordLength] = useState(0);
  const [typing, setTyping] = useState(true);
  const [index, setIndex] = useState(0);
  const requestRef = useRef<number>(0);

  // Simpan state dalam ref agar selalu update di animasi
  const indexRef = useRef(index);
  const typingRef = useRef(typing);
  const wordLengthRef = useRef(wordLength);

  useEffect(() => {
    indexRef.current = index;
    typingRef.current = typing;
    wordLengthRef.current = wordLength;
  }, [index, typing, wordLength]);

  useEffect(() => {
    let startTime = 0;

    const animate = (time: number) => {
      if (startTime === 0) startTime = time;

      const currentIndex = indexRef.current;
      const currentTyping = typingRef.current;
      const currentLength = wordLengthRef.current;

      if (texts.length === 0 || !texts[currentIndex]) return;

      const currentText = texts[currentIndex];

      if (currentTyping) {
        if (currentLength < currentText.length) {
          if (time - startTime >= speed) {
            setWordLength(currentLength + 1);
            startTime = time;
          }
        } else {
          if (time - startTime >= delay) {
            setTyping(false);
            startTime = time;
          }
        }
      } else {
        if (currentLength > 0) {
          if (time - startTime >= eraseSpeed) {
            setWordLength(currentLength - 1);
            startTime = time;
          }
        } else {
          if (time - startTime >= delay) {
            setTyping(true);
            setIndex((prev) => (prev + 1) % texts.length);
            startTime = time;
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [texts, speed, eraseSpeed, delay]);

  return (
    <span>
      {texts[index]?.slice(0, wordLength)}
      <span className="blinking-cursor">|</span>
    </span>
  );
}

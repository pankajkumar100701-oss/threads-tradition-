/** "Threads & Tradition" logotype: serif words with an italic gold ampersand. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-medium leading-none tracking-[0.02em] whitespace-nowrap ${className}`}>
      Threads <em className="font-normal text-gold">&amp;</em> Tradition
    </span>
  );
}

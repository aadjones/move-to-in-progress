import { useEffect, useState } from 'react';

interface Fragment {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
}

const fragmentTexts = ['BLOCKED', 'DEPRECATED', 'Sprint 5', '404', 'URGENT', 'PENDING', 'ESCALATED'];

export const FloatingFragments = ({ intensity }: { intensity: number }) => {
  const [fragments, setFragments] = useState<Fragment[]>([]);

  useEffect(() => {
    if (intensity < 0.1) return;

    const interval = setInterval(() => {
      const newFragment: Fragment = {
        id: Date.now(),
        text: fragmentTexts[Math.floor(Math.random() * fragmentTexts.length)],
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: Math.random() * 50 + 25, // 25-75% of viewport
        opacity: Math.random() * 0.5 + 0.3,
      };

      setFragments((prev) => [...prev, newFragment]);

      // Remove fragment after 2 seconds
      setTimeout(() => {
        setFragments((prev) => prev.filter((f) => f.id !== newFragment.id));
      }, 2000);
    }, 300);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {fragments.map((fragment) => (
        <div
          key={fragment.id}
          className="absolute text-red-600 font-bold text-xl glitch"
          style={{
            left: `${fragment.x}%`,
            top: `${fragment.y}%`,
            opacity: fragment.opacity * intensity,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
          }}
        >
          {fragment.text}
        </div>
      ))}
    </div>
  );
};

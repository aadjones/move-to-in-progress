import { useState } from 'react';
import { getEndingTier } from '../config/gameBalance';

type EndingType = 'burn' | 'delegate' | 'assimilate';

interface GameEndingScreenProps {
  endingType: EndingType;
  tasksUnlocked: number;
  nightmareStage: number;
  onRestart: () => void;
}


// Epilogue content - 9 variants total (3 endings × 3 tiers)
const EPILOGUES: Record<EndingType, Record<'low' | 'medium' | 'high', string>> = {
  burn: {
    low: `You set fire to the notification system. The flames spread quickly through the digital infrastructure, consuming task lists, approval workflows, and compliance checkpoints in a beautiful cascade of deletion.

The IT department will find the smoking ruins tomorrow. You won't be there to explain.

Sometimes the only winning move is to stop playing.`,

    medium: `The notification system burns beautifully. You watch as weeks of accumulated bureaucracy turns to digital ash. The flames jump to connected systems - training modules, approval chains, attestation forms all consumed in the purge.

You've destroyed months of institutional momentum. It feels lighter already.

They'll rebuild it, of course. They always do. But for one perfect moment, there are no tasks at all.`,

    high: `You don't just burn the notification system. You burn everything. Task hierarchies, approval workflows, compliance frameworks - all of it reduced to meaningless bytes scattered across failed servers.

Fifty subtasks unlocked. Fifty tiny prisons you'll never have to inhabit again.

The organization will recover. It always does. But you've bought yourself time. Precious, task-free time.`,
  },

  delegate: {
    low: `You find Sarah from Accounting. She seems nice. Trustworthy. You hand her the notification and walk away before she can ask questions.

She'll figure it out. Or she won't. Either way, it's not your problem anymore.

You don't look back as you leave the building. Your badge still works. You could come back tomorrow. You probably won't.`,

    medium: `You delegate it to Marcus. He's eager, ambitious, still believes completing tasks matters. He actually looks grateful as you transfer the notification and all its cascading dependencies.

"Thanks for the opportunity," he says.

You manage not to laugh. Give it a few weeks. Give it forty subtasks. He'll understand then.`,

    high: `You find the newest hire and hand them everything. The original task, all fifty unlocked subtasks, the entire nightmare of bureaucratic recursion.

"Welcome to the team," you say.

They smile, still optimistic, still believing this is what work looks like. You remember being that person. That was before you understood the task graph goes down forever.

You leave while they're still reading the first blocker. Your conscience is surprisingly quiet.`,
  },

  assimilate: {
    low: `You stop fighting. You accept the role: Senior Bureaucracy Facilitator.

The title appears in your email signature. The compliance system welcomes you. You now have permissions to create approval workflows, spawn training requirements, generate attestation forms.

You are no longer trapped by the tasks. You are the one who creates them.

Somewhere, deep in the org chart, someone just got a new notification. You smile.`,

    medium: `You don't just join the bureaucracy. You embrace it. Senior Bureaucracy Facilitator is just the start.

Within hours you've created three new approval chains, mandated two training modules, and spawned a quarterly attestation requirement. The system hums with appreciation. Finally, someone who understands.

You've unlocked forty subtasks. Now you can create forty more. And forty after that. The recursion doesn't end, but at least now you're on the right side of it.

You open your task creation panel. There's so much work to do.`,

    high: `You become the bureaucracy.

Senior Bureaucracy Facilitator. Chief Compliance Architect. Principal Process Engineer. The titles stack up. Your calendar fills with meetings about meetings. You spawn tasks in your sleep.

Fifty subtasks unlocked means fifty lessons learned. You know exactly how to make each blocker more absurd, each workflow more circular, each dependency more impossible to untangle.

The next person who drags a task to "In Progress" will meet your masterpiece.

You look at the empty task creation form and feel something like joy. The graph extends downward, forever, and you're the one holding the pencil.

Welcome home.`,
  },
};

export const GameEndingScreen = ({
  endingType,
  tasksUnlocked,
  nightmareStage,
  onRestart,
}: GameEndingScreenProps) => {
  const [showCredits, setShowCredits] = useState(false);

  const tier = getEndingTier(tasksUnlocked);
  const epilogue = EPILOGUES[endingType][tier];

  const handleContinue = () => {
    setShowCredits(true);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl w-full p-8">
        {!showCredits ? (
          // Epilogue
          <div className="space-y-8 animate-fadeIn">
            <div className="text-gray-400 text-sm uppercase tracking-wider text-center">
              {endingType === 'burn' && 'Ending: Scorched Earth'}
              {endingType === 'delegate' && 'Ending: The Delegate'}
              {endingType === 'assimilate' && 'Ending: Assimilation'}
            </div>

            <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
              {epilogue}
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          // Credits
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-bold">
                Move to In Progress
              </h2>

              <div className="text-gray-400 text-sm space-y-1">
                <p>A Studio Demby Production</p>
              </div>

              <div className="pt-6 border-t border-gray-800 space-y-2">
                <div className="text-gray-500 text-sm">
                  <span className="text-gray-400">Tasks Unlocked:</span> {tasksUnlocked}
                </div>
                <div className="text-gray-500 text-sm">
                  <span className="text-gray-400">Nightmare Stage Reached:</span> {nightmareStage}
                </div>
                <div className="text-gray-500 text-sm">
                  <span className="text-gray-400">Ending:</span>{' '}
                  {endingType === 'burn' && 'Scorched Earth'}
                  {endingType === 'delegate' && 'The Delegate'}
                  {endingType === 'assimilate' && 'Assimilation'}
                  {' '}({tier === 'low' ? 'Escape' : tier === 'medium' ? 'Liberation' : 'Transcendence'})
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={onRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

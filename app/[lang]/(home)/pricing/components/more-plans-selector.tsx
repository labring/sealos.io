'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useButtonHandler } from '@/hooks/use-button-handler';

interface Plan {
  id: string;
  name: string;
  price: string;
  description?: string;
}

interface MorePlansSelectorProps {
  onCheckboxChange?: (checked: boolean) => void;
}

const morePlans: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$128/month',
    description: 'For individual users and small businesses'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$12,451/month',
    description: 'For teams of 10-50 people'
  },
  {
    id: 'customized',
    name: 'Customized',
    price: 'Contact Us',
    description: 'For teams of 50+ people'
  }
];

export function MorePlansSelector({ onCheckboxChange }: MorePlansSelectorProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(morePlans[0]);

  const handleUpgrade = () => {
    window.open('https://os.sealos.io/?openapp=system-costcenter?mode%3dcreate', '_blank', 'noopener,noreferrer');
  };

  const handleCheckboxChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckboxChange?.(newChecked);
  };

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'customized') {
      window.open('https://forms.sealos.in/form/po5b21Si', '_blank', 'noopener,noreferrer');
    } else {
      setSelectedPlan(plan);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center mt-8">
      {/* Fixed width container, always centered */}
      <div className="flex items-center gap-3">
        {/* Checkbox - Always same position */}
        <button
          onClick={handleCheckboxChange}
          className="relative h-5 w-5 flex-shrink-0"
          aria-label="Select more plans"
        >
          <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${isChecked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'} transition-colors`}>
            {isChecked && (
              <Check className="h-3 w-3 text-white" />
            )}
          </div>
        </button>

        {/* Label - Always same position */}
        <span className="text-gray-700 font-medium flex-shrink-0">More Plans</span>

        {/* Dropdown and Button container - Fixed total width of 520px */}
        <div className="flex items-center gap-3 w-[820px]">
          {/* Dropdown - Shrinks from right when checked */}
          <div className={`relative transition-all duration-300 ${isChecked ? 'w-[700px]' : 'w-full'}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{selectedPlan.name}</span>
                {selectedPlan.price && (
                  <span className="text-gray-500 text-sm">({selectedPlan.price})</span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {morePlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 ${
                      selectedPlan.id === plan.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">{plan.price}</span>
                        {selectedPlan.id === plan.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade Button - Only visible when checked */}
          {isChecked && (
            <button
              onClick={handleUpgrade}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex-shrink-0 transition-all duration-300"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Expense, ExpenseCategory, SquadMember } from '../types';
import {
  X,
  Wallet,
  Plus,
  Train,
  Car,
  UtensilsCrossed,
  Ticket,
  AlertCircle,
  Receipt,
  Trash2,
} from 'lucide-react';

interface BudgetTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  onDeleteExpense: (id: string) => void;
  targetBudgetPerHead: number;
  onUpdateTargetBudget: (amount: number) => void;
  squadMembers: SquadMember[];
}

export const BudgetTrackerModal: React.FC<BudgetTrackerModalProps> = ({
  isOpen,
  onClose,
  expenses,
  onAddExpense,
  onDeleteExpense,
  targetBudgetPerHead,
  onUpdateTargetBudget,
  squadMembers,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food_bhog');
  const [paidBy, setPaidBy] = useState(squadMembers[0]?.id || 'user-1');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const memberCount = Math.max(1, squadMembers.length);
  const spentPerHead = Math.round(totalSpent / memberCount);
  const remainingBudgetPerHead = targetBudgetPerHead - spentPerHead;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!description || isNaN(num) || num <= 0) return;

    const payer = squadMembers.find((m) => m.id === paidBy);

    onAddExpense({
      description: description.trim(),
      amount: num,
      category,
      paidByMemberId: paidBy,
      paidByName: payer ? payer.name : 'Squad Mate',
      splitWithMemberIds: squadMembers.map((m) => m.id),
    });

    setDescription('');
    setAmount('');
    setIsAdding(false);
  };

  const getCategoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'metro_train':
        return <Train className="w-3.5 h-3.5 text-blue-600" />;
      case 'taxi_auto':
        return <Car className="w-3.5 h-3.5 text-amber-600" />;
      case 'food_bhog':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-red-600" />;
      case 'pass_vip':
        return <Ticket className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-700 via-amber-800 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-200" />
            <div>
              <h2 className="font-serif font-black text-lg leading-tight">
                Puja Hopping Budget
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                Kolkata Metro, Cabs, Bhog & Street Food Splitter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Summary Dashboard */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-amber-950 font-bold mb-1">
              <span>Per-Head Budget: ₹{targetBudgetPerHead}</span>
              <span className={remainingBudgetPerHead < 0 ? 'text-red-700 font-extrabold' : 'text-emerald-700'}>
                {remainingBudgetPerHead >= 0
                  ? `₹${remainingBudgetPerHead} remaining`
                  : `₹${Math.abs(remainingBudgetPerHead)} over budget!`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-amber-200/80 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  spentPerHead > targetBudgetPerHead ? 'bg-red-600' : 'bg-amber-600'
                }`}
                style={{
                  width: `${Math.min(100, (spentPerHead / targetBudgetPerHead) * 100)}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Total Squad Spend</span>
                <span className="font-extrabold text-stone-900 text-sm">₹{totalSpent}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-500 block">Avg Spend / Person</span>
                <span className="font-extrabold text-stone-900 text-sm">₹{spentPerHead}</span>
              </div>
            </div>
          </div>

          {/* Add Expense Toggle */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-red-300 hover:border-red-600 text-red-700 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense (Puchka, Cab, Pass...)</span>
            </button>
          ) : (
            <form
              onSubmit={handleAdd}
              className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-stone-900">Add New Expense</h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 4 Rolls at Hatibagan"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-2 p-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-600"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-600"
                  required
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-600"
                >
                  <option value="food_bhog">Food & Street Treats</option>
                  <option value="metro_train">Metro & Train</option>
                  <option value="taxi_auto">Yellow Taxi & Auto</option>
                  <option value="pass_vip">Puja Passes / VIP</option>
                  <option value="emergency">Emergency / Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 block mb-1">
                  Paid By
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs outline-none"
                >
                  {squadMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Save & Split Equally
              </button>
            </form>
          )}

          {/* Expense Items List */}
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 mb-2">
              Expense Log ({expenses.length})
            </h4>
            {expenses.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                No expenses logged yet. Tap above to track squad spending!
              </p>
            ) : (
              <div className="space-y-1.5">
                {expenses.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 block">
                          {item.description}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Paid by {item.paidByName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-xs">
                        ₹{item.amount}
                      </span>
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="text-stone-400 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

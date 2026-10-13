import React, { useState, useEffect } from 'react';
import { SquadGroup, SquadMember, Pandal } from '../types';
import {
  X,
  Users,
  Copy,
  MapPin,
  Shield,
  PhoneCall,
  CheckCircle2,
  Radio,
  Sparkles,
  Crown,
  Edit3,
  UserPlus,
  Trash2,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  squad: SquadGroup;
  currentUserId: string;
  isSharingLocation: boolean;
  onToggleLocationSharing: (enable: boolean) => void;
  onUpdateSquad: (updatedSquad: SquadGroup) => void;
  allPandals: Pandal[];
  defaultToEdit?: boolean;
}

export const SquadModal: React.FC<SquadModalProps> = ({
  isOpen,
  onClose,
  squad,
  currentUserId,
  isSharingLocation,
  onToggleLocationSharing,
  onUpdateSquad,
  allPandals,
  defaultToEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(defaultToEdit);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(squad.name);
  const [editCode, setEditCode] = useState(squad.code);
  const [editLeaderId, setEditLeaderId] = useState(squad.leaderId || squad.members[0]?.id || currentUserId);
  const [editMeetingPoint, setEditMeetingPoint] = useState(squad.meetingPoint);
  const [editEmergencyContact, setEditEmergencyContact] = useState(squad.emergencyContact);
  const [editMembers, setEditMembers] = useState<SquadMember[]>(squad.members);

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  // Synchronize form when squad changes or modal opens
  useEffect(() => {
    setEditName(squad.name);
    setEditCode(squad.code);
    setEditLeaderId(squad.leaderId || squad.members[0]?.id || currentUserId);
    setEditMeetingPoint(squad.meetingPoint);
    setEditEmergencyContact(squad.emergencyContact);
    setEditMembers(squad.members);
    setIsEditing(defaultToEdit);
  }, [squad, isOpen, defaultToEdit, currentUserId]);

  if (!isOpen) return null;

  const currentLeader = squad.members.find(
    (m) => m.id === (squad.leaderId || squad.members[0]?.id)
  ) || squad.members[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(squad.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGenerateNewCode = () => {
    const randomCode = `PUJA-${Math.floor(100000 + Math.random() * 900000)}`;
    setEditCode(randomCode);
  };

  const handleAddNewMember = () => {
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    const newMember: SquadMember = {
      id: `user-${Date.now()}`,
      name: trimmed,
      avatar: trimmed.charAt(0).toUpperCase(),
      role: 'member',
      isSharingLocation: false,
      visitedPandalIds: [],
    };

    setEditMembers((prev) => [...prev, newMember]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const handleRemoveMember = (idToRemove: string) => {
    if (editMembers.length <= 1) {
      alert('A squad must have at least one member.');
      return;
    }

    const updated = editMembers.filter((m) => m.id !== idToRemove);
    setEditMembers(updated);

    // If removed member was leader, transfer leadership to first remaining member
    if (editLeaderId === idToRemove) {
      setEditLeaderId(updated[0].id);
    }
  };

  const handleDesignateLeader = (newLeaderId: string) => {
    setEditLeaderId(newLeaderId);
  };

  const handleSaveAll = () => {
    const updatedSquad: SquadGroup = {
      ...squad,
      name: editName.trim() || 'My Puja Squad',
      code: editCode.trim() || squad.code,
      leaderId: editLeaderId,
      meetingPoint: editMeetingPoint.trim() || squad.meetingPoint,
      emergencyContact: editEmergencyContact.trim() || squad.emergencyContact,
      members: editMembers.map((m) => ({
        ...m,
        role: m.id === editLeaderId ? 'leader' : 'member',
      })),
    };

    onUpdateSquad(updatedSquad);
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditName(squad.name);
    setEditCode(squad.code);
    setEditLeaderId(squad.leaderId || squad.members[0]?.id || currentUserId);
    setEditMeetingPoint(squad.meetingPoint);
    setEditEmergencyContact(squad.emergencyContact);
    setEditMembers(squad.members);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 via-red-800 to-amber-800 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Users className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl leading-tight">
                  {isEditing ? 'Edit Squad & Leader' : squad.name}
                </h2>
                {!isEditing && (
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {squad.members.length} Hoppers
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {isEditing
                  ? 'Update squad name, designate squad leader & manage members'
                  : 'Live Squad Coordination & Location Sharing'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors shadow-xs"
                title="Edit squad name, leader and settings"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Edit Squad</span>
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save success toast feedback */}
        {saveFeedback && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Squad details and leader successfully updated!</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* ========================================================= */}
          {/* EDIT SQUAD & SQUAD LEADER MODE */}
          {/* ========================================================= */}
          {isEditing ? (
            <div className="space-y-4">
              {/* Squad Name Input */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-red-700" />
                  <span>Squad Name</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. North Kolkata Dhaakis & Hoppers"
                  className="w-full p-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none font-medium"
                />
              </div>

              {/* Squad Leader Selection */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-300/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Designated Squad Leader</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-200/80 font-bold px-2 py-0.5 rounded-full">
                    👑 Leader Control
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  The squad leader coordinates meeting points, manages the group itinerary, and guides the hopping route.
                </p>

                <select
                  value={editLeaderId}
                  onChange={(e) => handleDesignateLeader(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none font-semibold text-stone-900 shadow-xs"
                >
                  {editMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      👑 {member.name} {member.id === currentUserId ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passcode & Regeneration */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Squad Passcode (For Friends to Join)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewCode}
                    className="flex items-center gap-1 text-[11px] font-semibold text-red-700 hover:text-red-800"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 font-mono font-bold tracking-wider text-sm bg-white border border-stone-300 rounded-xl focus:border-red-600 outline-none"
                />
              </div>

              {/* Meeting Point & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-700" />
                    <span>Meeting Point</span>
                  </label>
                  <input
                    type="text"
                    value={editMeetingPoint}
                    onChange={(e) => setEditMeetingPoint(e.target.value)}
                    placeholder="e.g. Shyambazar Metro Gate 1"
                    className="w-full p-2 text-xs bg-white border border-stone-300 rounded-lg outline-none"
                  />
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-red-700" />
                    <span>Emergency SOS Contact</span>
                  </label>
                  <input
                    type="text"
                    value={editEmergencyContact}
                    onChange={(e) => setEditEmergencyContact(e.target.value)}
                    placeholder="e.g. 100 / 112 or Phone number"
                    className="w-full p-2 text-xs bg-white border border-stone-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Members Manager */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-700" />
                    <span>Manage Squad Members ({editMembers.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddMember((prev) => !prev)}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Hopper</span>
                  </button>
                </div>

                {/* Add member inline form */}
                {showAddMember && (
                  <div className="p-3 bg-white rounded-xl border border-red-200 space-y-2 animate-in fade-in">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Add Friend / Family Member
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Friend's Name (e.g. Sourav, Poulomi)"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="flex-1 p-2 text-xs border border-stone-300 rounded-lg outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNewMember()}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewMember}
                        className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Member list with Leader promote & Remove */}
                <div className="space-y-2">
                  {editMembers.map((member) => {
                    const isLeader = member.id === editLeaderId;
                    const isMe = member.id === currentUserId;

                    return (
                      <div
                        key={member.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                          isLeader
                            ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                              isLeader
                                ? 'bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-400'
                                : 'bg-stone-200 text-stone-800'
                            }`}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900">
                                {member.name}
                              </span>
                              {isMe && (
                                <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                                  You
                                </span>
                              )}
                              {isLeader && (
                                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5 fill-current" />
                                  Leader
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500">
                              {member.visitedPandalIds.length} pandals hopped
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!isLeader ? (
                            <button
                              type="button"
                              onClick={() => handleDesignateLeader(member.id)}
                              className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              title="Make this member the squad leader"
                            >
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Make Leader</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-amber-800 font-bold px-2 py-0.5 bg-amber-200/80 rounded-md">
                              Current Leader
                            </span>
                          )}

                          {editMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove member from squad"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex-1 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Squad Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW SQUAD & LIVE LOCATION STATUS MODE */
            /* ========================================================= */
            <>
              {/* Squad Leader Hero Card */}
              <div className="bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-orange-500/10 border-2 border-amber-400/80 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 font-black flex items-center justify-center text-lg shadow-sm ring-2 ring-amber-300">
                    <Crown className="w-6 h-6 text-stone-950 fill-stone-950" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-900 font-black uppercase tracking-wider block">
                      👑 Squad Leader
                    </span>
                    <h3 className="font-serif font-black text-base text-stone-900">
                      {currentLeader?.name}{' '}
                      {currentLeader?.id === currentUserId && (
                        <span className="text-xs font-normal text-stone-600">
                          (You)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-600">
                      Coordinates meeting times, itinerary, and live navigation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black transition-colors shadow-xs flex items-center gap-1"
                  title="Change squad leader or squad name"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change Leader</span>
                </button>
              </div>

              {/* Squad Invite Code Card */}
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-900/70 font-semibold uppercase tracking-wider block">
                    Squad Passcode
                  </span>
                  <span className="font-mono font-black text-xl text-stone-900 tracking-widest">
                    {squad.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied! ✓' : 'Copy'}</span>
                </button>
              </div>

              {/* Privacy Consent Box: Real Location Sharing */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio
                      className={`w-4 h-4 ${
                        isSharingLocation
                          ? 'text-emerald-600 animate-pulse'
                          : 'text-stone-400'
                      }`}
                    />
                    <span className="font-bold text-xs sm:text-sm text-stone-900">
                      Share Live Location with Squad
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSharingLocation}
                      onChange={(e) => onToggleLocationSharing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  🔒 Opt-in only. Your coordinates are shared only with members in
                  this squad to find each other in crowds. You can stop sharing at
                  any moment.
                </p>
              </div>

              {/* Designated Meeting Point & Emergency Shortcut */}
              <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-700" />
                    <span>Squad Meeting Point</span>
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] text-red-700 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-stone-800 font-medium">
                  {squad.meetingPoint}
                </p>

                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-xs">
                  <span className="text-stone-600 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-red-700" />
                    <span>Police / Medical SOS:</span>
                  </span>
                  <a
                    href={`tel:${squad.emergencyContact}`}
                    className="font-bold text-red-700 hover:underline"
                  >
                    {squad.emergencyContact} (Lalbazar HQ)
                  </a>
                </div>
              </div>

              {/* Members List with Mutual Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                    Squad Members ({squad.members.length})
                  </h4>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] text-red-700 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Manage Members</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {squad.members.map((member) => {
                    const isMe = member.id === currentUserId;
                    const isLeader =
                      member.id === (squad.leaderId || squad.members[0]?.id);
                    const visitedCount = member.visitedPandalIds.length;
                    const isLive = member.isSharingLocation && member.lastLocation;
                    const isStale =
                      isLive &&
                      Date.now() - member.lastLocation!.updatedAt > 10 * 60 * 1000;

                    return (
                      <div
                        key={member.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isLeader
                            ? 'bg-amber-50/60 border-amber-300/80 shadow-xs'
                            : 'bg-stone-50 border border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                              isLeader
                                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                                : 'bg-gradient-to-tr from-red-600 to-amber-600 text-white'
                            }`}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900">
                                {member.name}
                              </span>
                              {isMe && (
                                <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                                  You
                                </span>
                              )}
                              {isLeader && (
                                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5 fill-current" />
                                  Leader
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500">
                              {visitedCount} pandals hopped
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          {isLive ? (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isStale
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isStale ? 'GPS Stale (>10m)' : 'Live on Map'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">
                              Location paused
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-stone-500">
            {isEditing ? (
              <span>Review inputs before clicking Save</span>
            ) : (
              <span>Passcode: <strong className="font-mono">{squad.code}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Squad & Leader</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  History,
  MessageSquare,
  Search,
  Trash2,
  Clock,
  ArrowRight,
  Loader2,
  Languages
} from 'lucide-react';

export const ConversationHistoryPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { showToast } = useToast();

  const loadConversations = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await api.getConversations(currentPage, 15);
      setConversations(res.conversations || []);
      setTotalPages(res.pagination?.pages || 1);
      setPage(currentPage);
    } catch (err: any) {
      showToast('Failed to load conversation history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await api.deleteConversation(id);
      showToast('Conversation deleted.', 'info');
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      showToast('Failed to delete conversation.', 'error');
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <History className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Conversation History</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past voice and text interactions across your sessions.
          </p>
        </div>

        <Link
          to="/assistant"
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors self-start sm:self-auto shadow-glow-violet"
        >
          New Conversation
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversation topics or keywords..."
          className="w-full pl-10 pr-4 py-3 bg-[#151D32] border border-[#27324A] rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-400">Loading history...</span>
        </div>
      ) : filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <Link
              key={conv._id}
              to={`/assistant?conversationId=${conv._id}`}
              className="block p-4 sm:p-5 rounded-2xl bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] hover:border-violet-500/40 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-slate-100 group-hover:text-white truncate">
                      {conv.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(conv.lastMessageAt || conv.createdAt).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#10172A] border border-[#27324A] text-[10px] font-mono text-cyan-300">
                      {conv.language || 'en-IN'}
                    </span>
                    <span>•</span>
                    <span>{conv.messageCount || 0} messages</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDelete(conv._id, e)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 rounded-xl bg-[#10172A] group-hover:bg-violet-600 text-slate-400 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#151D32] border border-[#27324A] text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No conversations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No conversations matched your search query. Try different terms.'
              : 'You have not started any conversations yet.'}
          </p>
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-glow-violet mt-2"
          >
            Start Conversation
          </Link>
        </div>
      )}
    </div>
  );
};


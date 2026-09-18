"use client";
import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Workflow {
  id: string;
  name: string;
  description: string;
  version: number;
  steps: any;
  updatedAt: string;
}

export default function OperationsgtWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '', version: 1, steps: '[]' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`${API}/workflows`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      const res = await fetch(`${API}/workflows/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkflows(prev => prev.filter(w => w.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let parsedSteps;
      try {
        parsedSteps = JSON.parse(newWorkflow.steps);
      } catch (err) {
        alert('Invalid JSON in steps');
        setSubmitting(false);
        return;
      }

      const res = await fetch(`${API}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkflow.name,
          description: newWorkflow.description,
          version: Number(newWorkflow.version),
          steps: parsedSteps
        })
      });

      if (res.ok) {
        setShowModal(false);
        setNewWorkflow({ name: '', description: '', version: 1, steps: '[]' });
        fetchWorkflows();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operations &gt; Workflows</h1>
          <p className="text-slate-500 mt-2 text-sm">Manage and configure automated workflows and booking logic.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
        >
          + Add New Workflow
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between bg-slate-50">
          <input type="text" placeholder="Search..." className="bg-white border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 w-64" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Name / Title</th>
                <th className="p-4">Version</th>
                <th className="p-4">Steps count</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading workflows...</td></tr>
              ) : workflows.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No workflows found. Create one to get started.</td></tr>
              ) : (
                workflows.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">...{w.id.slice(-6)}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{w.name}</div>
                      <div className="text-xs text-slate-500">{w.description}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">v{w.version}</td>
                    <td className="p-4 text-slate-600">
                      {Array.isArray(w.steps) ? w.steps.length : 0} step(s)
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(w.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 px-2 font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(w.id)} className="text-slate-400 hover:text-rose-600 px-2 font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Workflow</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input required type="text" value={newWorkflow.name} onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" placeholder="e.g. SALON_BOOKING_FLOW" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <input type="text" value={newWorkflow.description} onChange={e => setNewWorkflow({...newWorkflow, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" placeholder="Describe the workflow..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Version</label>
                <input required type="number" min="1" value={newWorkflow.version} onChange={e => setNewWorkflow({...newWorkflow, version: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Steps (JSON)</label>
                <textarea required rows={5} value={newWorkflow.steps} onChange={e => setNewWorkflow({...newWorkflow, steps: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-sm" placeholder="[{}]" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Create Workflow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

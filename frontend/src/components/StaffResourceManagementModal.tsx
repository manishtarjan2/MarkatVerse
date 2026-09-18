import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, User, LayoutGrid } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function StaffResourceManagementModal({ 
  queueId, 
  queueData, 
  onClose, 
  onUpdate 
}: { 
  queueId: string;
  queueData: any;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'staff'|'resources'>('staff');
  
  // Staff Form
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffServices, setStaffServices] = useState('');
  const [staffScheduleStart, setStaffScheduleStart] = useState('09:00');
  const [staffScheduleEnd, setStaffScheduleEnd] = useState('18:00');
  const [staffDays, setStaffDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [staffImage, setStaffImage] = useState<File | null>(null);
  const [staffImagePreview, setStaffImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Resource Form
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('Chair');
  const [resourceCapacity, setResourceCapacity] = useState(1);
  const [assignedStaffId, setAssignedStaffId] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStaffImage(file);
      setStaffImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!staffImage) return null;
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(staffImage);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = null;
    try {
      if (staffImage) imageUrl = await uploadImage();
      
      await fetch(`${API_URL}/service-queue/${queueId}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: staffName,
          role: staffRole,
          imageUrl: imageUrl,
          services: staffServices.split(',').map(s => s.trim()).filter(Boolean),
          workingHours: { start: staffScheduleStart, end: staffScheduleEnd, days: staffDays },
        })
      });
      
      setStaffName('');
      setStaffRole('');
      setStaffServices('');
      setStaffImage(null);
      setStaffImagePreview('');
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to add staff');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await fetch(`${API_URL}/service-queue/${queueId}/staff/${staffId}`, { method: 'DELETE' });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/service-queue/${queueId}/resource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resourceName,
          type: resourceType,
          capacity: resourceCapacity,
          assignedStaffId: assignedStaffId || null,
        })
      });
      
      setResourceName('');
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to add resource');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Remove this resource?')) return;
    try {
      await fetch(`${API_URL}/service-queue/${queueId}/resource/${resourceId}`, { method: 'DELETE' });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Manage Staff & Resources</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 py-4 px-6 font-semibold border-b-2 transition-colors ${activeTab === 'staff' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <User className="w-4 h-4" /> Staff Members
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 py-4 px-6 font-semibold border-b-2 transition-colors ${activeTab === 'resources' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Resources / Stations
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {activeTab === 'staff' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add Staff Form */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus className="w-4 h-4"/> Add New Staff</h3>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Image (Optional)</label>
                    <div className="flex items-center gap-4">
                      {staffImagePreview ? (
                        <img src={staffImagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" /> Upload
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                    <input type="text" required value={staffName} onChange={e => setStaffName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Role/Title</label>
                    <input type="text" required value={staffRole} onChange={e => setStaffRole(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Senior Barber, Therapist" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Assigned Services (comma-separated)</label>
                    <input type="text" value={staffServices} onChange={e => setStaffServices(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Haircut, Hair Color, Facial" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Working Schedule</label>
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Start Time</label>
                        <input type="time" value={staffScheduleStart} onChange={e => setStaffScheduleStart(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">End Time</label>
                        <input type="time" value={staffScheduleEnd} onChange={e => setStaffScheduleEnd(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button 
                          key={day} 
                          type="button" 
                          onClick={() => setStaffDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                          className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${staffDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button disabled={isUploading} type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {isUploading ? 'Saving...' : 'Add Staff Member'}
                  </button>
                </form>
              </div>

              {/* Staff List */}
              <div>
                <h3 className="font-bold text-slate-800 mb-4">Current Staff</h3>
                <div className="space-y-3">
                  {!queueData.staff || queueData.staff.length === 0 ? (
                    <div className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200 text-center">No staff added yet.</div>
                  ) : (
                    queueData.staff.map((s: any) => (
                      <div key={s.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                            <div className="text-xs text-slate-500 mb-1">{s.role}</div>
                            {s.services && s.services.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-1">
                                {s.services.map((srv: string) => (
                                  <span key={srv} className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">{srv}</span>
                                ))}
                              </div>
                            )}
                            {s.workingHours && (
                              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                🕒 {s.workingHours.start} - {s.workingHours.end} | {s.workingHours.days?.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteStaff(s.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add Resource Form */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus className="w-4 h-4"/> Add New Resource/Station</h3>
                <form onSubmit={handleAddResource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name / Identifier</label>
                    <input type="text" required value={resourceName} onChange={e => setResourceName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Chair 1, Room A, Table 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                    <select value={resourceType} onChange={e => setResourceType(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option>Chair</option>
                      <option>Room</option>
                      <option>Table</option>
                      <option>Service Bay</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Default Assigned Staff (Optional)</label>
                    <select value={assignedStaffId} onChange={e => setAssignedStaffId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option value="">-- None --</option>
                      {queueData.staff?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add Resource
                  </button>
                </form>
              </div>

              {/* Resource List */}
              <div>
                <h3 className="font-bold text-slate-800 mb-4">Current Resources</h3>
                <div className="space-y-3">
                  {!queueData.resources || queueData.resources.length === 0 ? (
                    <div className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200 text-center">No resources added yet.</div>
                  ) : (
                    queueData.resources.map((r: any) => {
                      const assignedStaff = queueData.staff?.find((s: any) => s.id === r.assignedStaffId);
                      return (
                        <div key={r.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{r.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              {r.type} {assignedStaff && <span className="text-blue-600 ml-1">• Assigned: {assignedStaff.name}</span>}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteResource(r.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

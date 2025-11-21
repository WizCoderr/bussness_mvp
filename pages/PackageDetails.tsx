import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDb } from '../services/mockDatabase';
import { Package } from '../types';
import { Clock, MapPin, CheckCircle, XCircle, Phone, MessageCircle, Calendar, User, Mail, FileText, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions'>('itinerary');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // AI State
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 2,
    date: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const found = mockDb.getPackage(id);
      setPkg(found || null);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setFormStatus('submitting');
    
    // Simulate network delay
    setTimeout(() => {
      try {
        mockDb.createLead({
          packageId: pkg.id,
          partnerId: pkg.partnerId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          travelers: formData.travelers,
          travelDate: formData.date,
          specialRequirements: formData.notes,
        });
        setFormStatus('success');
      } catch (err) {
        setFormStatus('error');
      }
    }, 1000);
  };

  const getWhatsAppLink = () => {
    if (!pkg) return '#';
    const text = encodeURIComponent(`Hi, I'm interested in the ${pkg.title} package starting from $${pkg.priceFrom}. My name is...`);
    // Ideally use partner phone, but mocked here to a generic one or use pkg partner details if fetched
    return `https://wa.me/?text=${text}`;
  };

  const askAiAboutRegion = async () => {
    if (!pkg || !process.env.API_KEY) return;
    setLoadingAi(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, engaging 2-sentence fun fact or travel tip about visiting ${pkg.region} specifically related to this itinerary: ${pkg.itinerary}`,
        });
        setAiTip(response.text);
    } catch (e) {
        console.error("AI Error", e);
        setAiTip("Could not load AI tip at the moment.");
    } finally {
        setLoadingAi(false);
    }
  };

  if (!pkg) return <div className="p-20 text-center">Loading package...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-brand-600 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Packages
                </Link>
            </div>
        </div>

      {/* Header Image */}
      <div className="relative h-96 w-full">
        <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-10 text-white">
            <span className="bg-brand-600 px-3 py-1 rounded text-sm font-bold mb-2 inline-block">
                {pkg.region}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{pkg.title}</h1>
            <div className="flex items-center gap-6 text-lg">
               <div className="flex items-center gap-2">
                 <Clock className="w-5 h-5 text-brand-400" />
                 <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
               </div>
               <div className="flex items-center gap-2 font-bold text-brand-300">
                 From ${pkg.priceFrom} / person
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b">
                <button 
                    onClick={() => setActiveTab('itinerary')}
                    className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === 'itinerary' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Itinerary
                </button>
                <button 
                    onClick={() => setActiveTab('inclusions')}
                    className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === 'inclusions' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Inclusions & Policy
                </button>
            </div>
            
            <div className="p-8">
                {activeTab === 'itinerary' && (
                    <div className="prose max-w-none text-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Day by Day Plan</h3>
                        <p className="whitespace-pre-line leading-relaxed">{pkg.itinerary}</p>

                        {/* AI Enhancement */}
                        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm">Curious about this region?</h4>
                                    {!aiTip && !loadingAi && (
                                        <button 
                                            onClick={askAiAboutRegion}
                                            className="mt-2 text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
                                        >
                                            Ask AI for a Quick Tip
                                        </button>
                                    )}
                                    {loadingAi && <p className="text-sm text-indigo-600 mt-1 animate-pulse">Consulting the travel guide...</p>}
                                    {aiTip && (
                                        <p className="text-sm text-indigo-800 mt-2 italic">"{aiTip}"</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'inclusions' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> What's Included
                            </h3>
                            <ul className="space-y-2">
                                {pkg.inclusions.map((inc, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                        {inc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                                <XCircle className="w-5 h-5" /> What's Excluded
                            </h3>
                            <ul className="space-y-2">
                                {pkg.exclusions.map((exc, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                                        {exc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Limited Availability</p>
                    <div className="text-3xl font-bold text-brand-600 mt-1">${pkg.priceFrom}</div>
                    <p className="text-gray-400 text-sm">per person (approx)</p>
                </div>

                {formStatus === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-green-800 mb-2">Request Sent!</h3>
                        <p className="text-green-700 text-sm">Our partner will contact you shortly to finalize your booking.</p>
                        <button onClick={() => setFormStatus('idle')} className="mt-4 text-sm underline text-green-800 hover:text-green-900">Send another inquiry</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <input 
                                    required
                                    name="name"
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone</label>
                                <input 
                                    required
                                    name="phone"
                                    type="tel" 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="+1 234..."
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Travelers</label>
                                <input 
                                    required
                                    name="travelers"
                                    type="number" 
                                    min="1"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.travelers}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <input 
                                    required
                                    name="email"
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Preferred Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <input 
                                    required
                                    name="date"
                                    type="date" 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                         <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Special Request</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <textarea 
                                    name="notes"
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="Vegetarian, window seat, etc."
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={formStatus === 'submitting'}
                            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {formStatus === 'submitting' ? 'Sending...' : (
                                <>
                                    <Phone className="w-4 h-4" /> Request Call Back
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-xs text-gray-500 mb-3">Prefer to chat instantly?</p>
                    <a 
                        href={getWhatsAppLink()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" /> WhatsApp Inquiry
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

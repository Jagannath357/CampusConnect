import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Mail, 
  FileLock2
} from 'lucide-react';

interface SystemConfig {
  _id: string;
  key: string;
  value: any;
  description: string;
  updatedAt: string;
}

export const SystemConfigurationPage: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Allowed Domains local state
  const [allowedDomains, setAllowedDomains] = useState<string[]>(['silicon.ac.in']);
  const [newDomainInput, setNewDomainInput] = useState('');

  // Campus Identity local state
  const [institutionName, setInstitutionName] = useState('Silicon University');
  const [campusLocation, setCampusLocation] = useState('Bhubaneswar, Odisha');
  const [tagline, setTagline] = useState('One Campus. One Community. One Connection.');
  const [contactSupportEmail, setContactSupportEmail] = useState('support@silicon.ac.in');

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/configuration');
      if (res.data.success) {
        const data: SystemConfig[] = res.data.data;
        setConfigs(data);

        // Populate local states
        const domainsConfig = data.find((c) => c.key === 'allowedEmailDomains');
        if (domainsConfig && Array.isArray(domainsConfig.value)) {
          setAllowedDomains(domainsConfig.value);
        }

        const identityConfig = data.find((c) => c.key === 'campusIdentity');
        if (identityConfig && identityConfig.value) {
          setInstitutionName(identityConfig.value.institutionName || 'Silicon University');
          setCampusLocation(identityConfig.value.campusLocation || 'Bhubaneswar, Odisha');
          setTagline(identityConfig.value.tagline || 'One Campus. One Community. One Connection.');
          setContactSupportEmail(identityConfig.value.contactSupportEmail || 'support@silicon.ac.in');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch system configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newDomainInput.trim().toLowerCase().replace(/^@/, '');
    if (!cleanDomain) return;

    if (allowedDomains.includes(cleanDomain)) {
      setError(`Domain "${cleanDomain}" is already in the permitted list.`);
      return;
    }

    setAllowedDomains([...allowedDomains, cleanDomain]);
    setNewDomainInput('');
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    if (allowedDomains.length <= 1) {
      setError('At least one authorized email domain must remain configured for student self-registration.');
      return;
    }
    setAllowedDomains(allowedDomains.filter((d) => d !== domainToRemove));
  };

  const handleSaveDomains = async () => {
    try {
      setSavingKey('allowedEmailDomains');
      setError(null);
      setSuccess(null);

      const res = await api.put('/admin/configuration/allowedEmailDomains', {
        value: allowedDomains,
        description: 'Official university email domains allowed for student self-registration.',
      });

      if (res.data.success) {
        setSuccess('Permitted registration email domains updated successfully.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save domains.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingKey('campusIdentity');
      setError(null);
      setSuccess(null);

      const res = await api.put('/admin/configuration/campusIdentity', {
        value: {
          institutionName,
          campusLocation,
          tagline,
          contactSupportEmail,
        },
        description: 'General university identity display settings.',
      });

      if (res.data.success) {
        setSuccess('University identity settings updated successfully.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update campus identity.');
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner />
        <p className="text-sm text-gray-500 mt-2">Loading system configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Single-Campus Configuration Control
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 border border-slate-600">
                  Module 15
                </span>
              </h1>
              <p className="text-sm text-slate-300">
                Configure Silicon University environmental boundaries, verified email domains, and portal metadata.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module 15: Allowed Email Domains (Decision Table 2) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b bg-gray-50/50">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Permitted Email Domains (Registration Guard)
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Enforces Decision Table 2 Rule 1: Student self-registration requires an institutional email ending with an authorized domain.
              </p>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <form onSubmit={handleAddDomain} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">
                    @
                  </span>
                  <Input
                    value={newDomainInput}
                    onChange={(e) => setNewDomainInput(e.target.value)}
                    placeholder="e.g., silicon.ac.in"
                    className="pl-8 text-sm"
                  />
                </div>
                <Button type="submit" variant="outline" className="flex items-center gap-1 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Add Domain
                </Button>
              </form>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                  Active Authorized Domains ({allowedDomains.length})
                </label>
                <div className="divide-y border rounded-lg overflow-hidden bg-white">
                  {allowedDomains.map((domain) => (
                    <div key={domain} className="p-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-semibold text-gray-800">@{domain}</span>
                        {domain === 'silicon.ac.in' && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDomain(domain)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove domain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <Button
                  onClick={handleSaveDomains}
                  disabled={savingKey === 'allowedEmailDomains'}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs"
                >
                  <Save className="w-4 h-4" />
                  {savingKey === 'allowedEmailDomains' ? 'Saving Domains...' : 'Save Email Domains'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campus Identity Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b bg-gray-50/50">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Campus Identity & Portal Metadata
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Silicon University single-campus branding and institutional parameters.
              </p>
            </CardHeader>

            <CardContent className="p-5">
              <form onSubmit={handleSaveIdentity} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Institution Name
                  </label>
                  <Input
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Campus Location / Address
                  </label>
                  <Input
                    value={campusLocation}
                    onChange={(e) => setCampusLocation(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    University Tagline
                  </label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    System Support Email
                  </label>
                  <Input
                    type="email"
                    value={contactSupportEmail}
                    onChange={(e) => setContactSupportEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingKey === 'campusIdentity'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-xs"
                  >
                    <Save className="w-4 h-4" />
                    {savingKey === 'campusIdentity' ? 'Updating Identity...' : 'Save Campus Identity'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Compliance & Audit Note */}
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl flex items-start gap-3">
            <FileLock2 className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong>Immutable Audit Logging:</strong> Any modification to campus settings or authentication parameters is permanently recorded to the append-only <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">AdminAuditLog</code> database collection with your admin ID and IP.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


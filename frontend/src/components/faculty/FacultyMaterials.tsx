import { useRef, useState } from 'react';
import { 
  Library, 
  Upload, 
  Search,
  FileText,
  Video,
  File,
  Download,
  Trash2
} from 'lucide-react';

interface FacultyMaterialsProps {
  activeTab: string;
}

export default function FacultyMaterials({ activeTab }: FacultyMaterialsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<any[]>([]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        // Add the new file to the mock UI
        setNewFiles(prev => [{
          name: file.name.split('.').slice(0, -1).join('.'),
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          course: 'Selected Course'
        }, ...prev]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    }
  };

  const renderMaterialsView = (title: string, icon: React.ElementType, type: 'pdf' | 'ppt' | 'video' | 'notes') => {
    const Icon = icon;
    
    // Mock data
    const files = [
      { name: 'Chapter 1: Introduction to Data Structures', size: '2.4 MB', date: 'Oct 15, 2023', course: 'CS401' },
      { name: 'Chapter 2: Complexity Analysis', size: '1.8 MB', date: 'Oct 18, 2023', course: 'CS401' },
      { name: 'Trees and Graphs Overview', size: '4.5 MB', date: 'Oct 20, 2023', course: 'CS401' },
      { name: 'Process Scheduling Algorithms', size: '3.2 MB', date: 'Oct 12, 2023', course: 'CS402' },
    ];

    // Combine mock data with newly uploaded files
    const displayFiles = [...newFiles, ...files];

    const getColors = () => {
      switch(type) {
        case 'pdf': return 'bg-red-50 text-red-600 border-red-200';
        case 'ppt': return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'video': return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'notes': return 'bg-blue-50 text-blue-600 border-blue-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-200';
      }
    };

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon size={24} className={getColors().split(' ')[1]} />
            {title}
          </h2>
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`px-4 py-2 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2
              ${isUploading ? 'bg-emerald-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} /> Upload New {type.toUpperCase()}
              </>
            )}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
            accept={type === 'pdf' ? '.pdf' : type === 'ppt' ? '.ppt,.pptx' : type === 'video' ? 'video/*' : '*/*'}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
              <option>All Courses</option>
              <option>CS401: Data Structures</option>
              <option>CS402: Operating Systems</option>
            </select>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayFiles.map((file, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition-all group relative bg-white">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-emerald-100 hover:text-emerald-700 transition-colors" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-red-100 hover:text-red-700 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${getColors()}`}>
                    <Icon size={24} />
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2" title={`${file.name}.${type}`}>
                    {file.name}.{type}
                  </h3>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{file.course}</span>
                    <span>{file.size}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Uploaded: {file.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-slate-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          The {title.toLowerCase()} module is ready for integration. Connect your database to manage study materials.
        </p>
      </div>
    );
  };

  switch (activeTab) {
    case 'materials-pdf':
      return renderMaterialsView('PDF Documents', FileText, 'pdf');
    case 'materials-ppt':
      return renderMaterialsView('Presentations', File, 'ppt');
    case 'materials-video':
      return renderMaterialsView('Video Lectures', Video, 'video');
    case 'materials-notes':
      return renderMaterialsView('Shared Notes', Library, 'notes');
    default:
      return renderPlaceholder('Study Materials', Library);
  }
}

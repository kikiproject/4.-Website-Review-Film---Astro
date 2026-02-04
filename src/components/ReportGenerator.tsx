import { useState, useRef } from 'react';
import { 
  FileText, Printer, Download, BarChart3, PieChart, Calendar,
  TrendingUp, Users, Film, Star, Eye, MessageCircle, Clock,
  ChevronDown, Filter, RefreshCw, Share2, Mail
} from 'lucide-react';

interface ReportData {
  period: string;
  totalMovies: number;
  totalReviews: number;
  totalUsers: number;
  totalViews: number;
  topMovies: { title: string; views: number; rating: number }[];
  topReviewers: { name: string; reviews: number; avatar: string }[];
  genreDistribution: { genre: string; count: number; percentage: number }[];
  monthlyStats: { month: string; reviews: number; users: number }[];
}

interface ReportGeneratorProps {
  type: 'admin' | 'user';
  userId?: string;
}

export default function ReportGenerator({ type, userId }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'overview' | 'movies' | 'users' | 'reviews'>('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Mock data
  const reportData: ReportData = {
    period: 'Januari 2026',
    totalMovies: 15420,
    totalReviews: 89750,
    totalUsers: 45230,
    totalViews: 2450000,
    topMovies: [
      { title: 'Dune: Part Two', views: 125000, rating: 8.9 },
      { title: 'Oppenheimer', views: 98000, rating: 8.7 },
      { title: 'Spider-Man: Across the Spider-Verse', views: 87000, rating: 9.0 },
      { title: 'The Boy and the Heron', views: 76000, rating: 8.5 },
      { title: 'Killers of the Flower Moon', views: 65000, rating: 8.3 },
    ],
    topReviewers: [
      { name: 'CinemaLover', reviews: 245, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CinemaLover' },
      { name: 'MovieBuff', reviews: 198, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff' },
      { name: 'FilmCritic', reviews: 176, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FilmCritic' },
    ],
    genreDistribution: [
      { genre: 'Action', count: 3250, percentage: 28 },
      { genre: 'Drama', count: 2890, percentage: 25 },
      { genre: 'Comedy', count: 1980, percentage: 17 },
      { genre: 'Sci-Fi', count: 1560, percentage: 13 },
      { genre: 'Horror', count: 1120, percentage: 10 },
      { genre: 'Romance', count: 820, percentage: 7 },
    ],
    monthlyStats: [
      { month: 'Jan', reviews: 8500, users: 4200 },
      { month: 'Feb', reviews: 7800, users: 3900 },
      { month: 'Mar', reviews: 9200, users: 4800 },
      { month: 'Apr', reviews: 8900, users: 4500 },
      { month: 'Mei', reviews: 10500, users: 5200 },
      { month: 'Jun', reviews: 11200, users: 5800 },
    ],
  };

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setShowPreview(true);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Laporan ASTRO - ${reportData.period}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1A2DE7; padding-bottom: 20px; }
              .logo { font-size: 36px; font-weight: bold; color: #1A2DE7; }
              .period { color: #666; margin-top: 10px; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
              .stat-card { background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center; }
              .stat-value { font-size: 28px; font-weight: bold; color: #1A2DE7; }
              .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
              .section { margin-bottom: 40px; }
              .section-title { font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #1A2DE7; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
              th { background: #f8f9fa; font-weight: 600; }
              .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
              .chart-placeholder { height: 200px; background: linear-gradient(135deg, #1A2DE7 0%, #8F29BC 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">⭐ ASTRO</div>
              <p style="color: #666;">Website Review Film Indonesia</p>
              <p class="period">Laporan Periode: ${reportData.period}</p>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${reportData.totalMovies.toLocaleString()}</div>
                <div class="stat-label">Total Film</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportData.totalReviews.toLocaleString()}</div>
                <div class="stat-label">Total Review</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${reportData.totalUsers.toLocaleString()}</div>
                <div class="stat-label">Total Pengguna</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${(reportData.totalViews / 1000000).toFixed(1)}M</div>
                <div class="stat-label">Total Views</div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">🎬 Top 5 Film Terpopuler</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Judul Film</th>
                    <th>Views</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData.topMovies.map((movie, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${movie.title}</td>
                      <td>${movie.views.toLocaleString()}</td>
                      <td>⭐ ${movie.rating}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2 class="section-title">📊 Distribusi Genre</h2>
              <table>
                <thead>
                  <tr>
                    <th>Genre</th>
                    <th>Jumlah</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData.genreDistribution.map(genre => `
                    <tr>
                      <td>${genre.genre}</td>
                      <td>${genre.count.toLocaleString()}</td>
                      <td>${genre.percentage}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2 class="section-title">👑 Top Reviewer</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Total Review</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData.topReviewers.map((reviewer, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${reviewer.name}</td>
                      <td>${reviewer.reviews}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Laporan ini dibuat secara otomatis oleh sistem ASTRO</p>
              <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
              <p>© 2026 ASTRO - Website Review Film Indonesia</p>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const downloadPDF = () => {
    // In production, use a library like jsPDF or call an API
    alert('Mengunduh laporan dalam format PDF...');
  };

  const downloadExcel = () => {
    // In production, use a library like xlsx or call an API
    alert('Mengunduh laporan dalam format Excel...');
  };

  return (
    <div className="bg-dark-400 rounded-2xl border border-dark-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-dark-100 bg-gradient-to-r from-primary-500/10 to-violet-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generator Laporan</h2>
              <p className="text-sm text-secondary-400">Buat dan cetak laporan statistik</p>
            </div>
          </div>
          
          {showPreview && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white transition-colors"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-colors"
              >
                <Download className="w-4 h-4" /> Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="p-6 border-b border-dark-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-secondary-400 mb-2">Jenis Laporan</label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-dark-300 border border-dark-100 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary-500"
              >
                <option value="overview">📊 Overview</option>
                <option value="movies">🎬 Film & Rating</option>
                <option value="users">👥 Pengguna</option>
                <option value="reviews">📝 Review</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-secondary-400 mb-2">Periode</label>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full bg-dark-300 border border-dark-100 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary-500"
              >
                <option value="week">📅 Minggu Ini</option>
                <option value="month">📅 Bulan Ini</option>
                <option value="quarter">📅 Kuartal Ini</option>
                <option value="year">📅 Tahun Ini</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-500 hover:from-primary-600 hover:to-violet-600 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" /> Generate Laporan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div ref={printRef} className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-300 rounded-xl p-4 text-center">
              <Film className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reportData.totalMovies.toLocaleString()}</div>
              <div className="text-sm text-secondary-400">Total Film</div>
            </div>
            <div className="bg-dark-300 rounded-xl p-4 text-center">
              <MessageCircle className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reportData.totalReviews.toLocaleString()}</div>
              <div className="text-sm text-secondary-400">Total Review</div>
            </div>
            <div className="bg-dark-300 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-magenta-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reportData.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-secondary-400">Total Pengguna</div>
            </div>
            <div className="bg-dark-300 rounded-xl p-4 text-center">
              <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{(reportData.totalViews / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-secondary-400">Total Views</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Movies */}
            <div className="bg-dark-300 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" /> Top 5 Film Terpopuler
              </h3>
              <div className="space-y-3">
                {reportData.topMovies.map((movie, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-xs text-primary-400 font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm">{movie.title}</p>
                      <p className="text-xs text-secondary-400">{movie.views.toLocaleString()} views</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{movie.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-dark-300 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-400" /> Distribusi Genre
              </h3>
              <div className="space-y-3">
                {reportData.genreDistribution.map((genre, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white">{genre.genre}</span>
                      <span className="text-secondary-400">{genre.percentage}%</span>
                    </div>
                    <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${genre.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Reviewers */}
            <div className="bg-dark-300 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" /> Top Reviewer
              </h3>
              <div className="space-y-3">
                {reportData.topReviewers.map((reviewer, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={reviewer.avatar} alt={reviewer.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{reviewer.name}</p>
                      <p className="text-xs text-secondary-400">{reviewer.reviews} reviews</p>
                    </div>
                    {i === 0 && <span className="text-xl">👑</span>}
                    {i === 1 && <span className="text-xl">🥈</span>}
                    {i === 2 && <span className="text-xl">🥉</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-dark-300 rounded-xl p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" /> Statistik Bulanan
              </h3>
              <div className="flex items-end gap-2 h-32">
                {reportData.monthlyStats.map((stat, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500 to-violet-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(stat.reviews / 12000) * 100}%` }}
                    ></div>
                    <span className="text-xs text-secondary-400">{stat.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

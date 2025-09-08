import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calendar, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'equipment-guide-beginners',
    title: 'Kürek Sporuna Yeni Başlayanlar İçin Ekipman Rehberi',
    excerpt: 'Kürek sporu, hem fiziksel hem de zihinsel dayanıklılık gerektiren, teknik bilgi ve doğru ekipman seçimi ile başarıya ulaşılabilen bir spordur.',
    content: `Kürek sporu, hem fiziksel hem de zihinsel dayanıklılık gerektiren, teknik bilgi ve doğru ekipman seçimi ile başarıya ulaşılabilen bir spordur. Yeni başlayanlar için doğru ekipman seçimi, sporun temelini oluşturan en önemli faktörlerden biridir.

İlk olarak, kürek seçiminde dikkat edilmesi gereken noktalar:
- Kürek boyutu ve ağırlığı
- Malzeme kalitesi
- Ergonomik tasarım
- Bütçe uygunluğu

Kürek tekneleri seçiminde ise:
- Tekne tipi (tek kürek, çift kürek)
- Malzeme (ahşap, karbon fiber, kompozit)
- Boyut ve ağırlık
- Stabilite faktörü

Ayrıca güvenlik ekipmanları da göz ardı edilmemelidir:
- Can yeleği
- Güneş gözlüğü
- Uygun kıyafet
- Su geçirmez çanta

Bu rehber, yeni başlayan kürekçilerin doğru ekipman seçimi yapmasına yardımcı olmak için hazırlanmıştır.`,
    author: 'Ayger',
    date: 'February 28, 2025',
    category: 'Equipment',
    readTime: '5 min read'
  },
  {
    id: 'training-techniques-professionals',
    title: 'Profesyonel Kürekçiler İçin En İyi Antrenman Teknikleri',
    excerpt: 'Kürek sporunda başarılı olmak sadece su üzerinde antrenman yapmakla sınırlı değildir. Karada gerçekleştirilen dayanıklılık, kuvvet ve teknik çalışmalar da büyük önem taşır.',
    content: `Kürek sporunda başarılı olmak sadece su üzerinde antrenman yapmakla sınırlı değildir. Karada gerçekleştirilen dayanıklılık, kuvvet ve teknik çalışmalar da büyük önem taşır.

Profesyonel kürekçiler için önerilen antrenman teknikleri:

1. **Dayanıklılık Antrenmanları**
   - Uzun mesafe koşuları
   - Bisiklet antrenmanları
   - Yüzme seansları
   - Ergometer çalışmaları

2. **Kuvvet Antrenmanları**
   - Squat ve deadlift egzersizleri
   - Core güçlendirme
   - Üst vücut kuvveti
   - Plyometric egzersizler

3. **Teknik Çalışmalar**
   - Stroke tekniği analizi
   - Video analizi
   - Mental antrenman
   - Takım koordinasyonu

4. **Beslenme ve Dinlenme**
   - Protein ağırlıklı beslenme
   - Karbonhidrat yükleme
   - Hidrasyon
   - Yeterli uyku

Bu teknikler, profesyonel kürekçilerin performansını maksimum seviyeye çıkarmalarına yardımcı olur.`,
    author: 'Ayger',
    date: 'February 28, 2025',
    category: 'Training',
    readTime: '8 min read'
  },
  {
    id: 'carbon-fiber-advantages',
    title: 'Karbon Fiber Küreklerin Avantajları ve Kullanım Rehberi',
    excerpt: 'Karbon fiber kürekler, profesyonel ve yarı-şampiyona seviyesindeki kürekçiler tarafından tercih edilen en popüler ekipmanlardan biridir.',
    content: `Karbon fiber kürekler, profesyonel ve yarı-şampiyona seviyesindeki kürekçiler tarafından tercih edilen en popüler ekipmanlardan biridir. Bu malzemenin sunduğu avantajlar, kürekçilerin performansını önemli ölçüde artırır.

**Karbon Fiber Küreklerin Avantajları:**

1. **Hafiflik**
   - Geleneksel malzemelere göre %30-50 daha hafif
   - Daha az yorgunluk
   - Hızlı tepki süresi

2. **Dayanıklılık**
   - Yüksek mukavemet
   - Uzun ömürlü kullanım
   - Düşük bakım gereksinimi

3. **Performans**
   - Optimize edilmiş aerodinamik tasarım
   - Daha iyi su geçişi
   - Artırılmış hız potansiyeli

4. **Özelleştirme**
   - Farklı sertlik seçenekleri
   - Kişiselleştirilmiş boyutlar
   - Renk ve tasarım seçenekleri

**Kullanım Rehberi:**
- Doğru boyut seçimi
- Bakım ve temizlik
- Depolama koşulları
- Güvenlik önlemleri

Karbon fiber kürekler, ciddi kürekçiler için en iyi yatırımdır.`,
    author: 'Ayger',
    date: 'February 28, 2025',
    category: 'Technology',
    readTime: '6 min read'
  },
  {
    id: 'mental-preparation-rowing',
    title: 'Kürek Yarışlarında Mental Hazırlık Teknikleri',
    excerpt: 'Kürek yarışlarında başarı, sadece fiziksel hazırlıkla değil, aynı zamanda güçlü bir mental hazırlıkla da gelir.',
    content: `Kürek yarışlarında başarı, sadece fiziksel hazırlıkla değil, aynı zamanda güçlü bir mental hazırlıkla da gelir. Mental hazırlık, yarış sırasında odaklanmayı korumak ve performansı maksimize etmek için kritik öneme sahiptir.

**Mental Hazırlık Teknikleri:**

1. **Görselleştirme**
   - Yarış senaryolarını zihinde canlandırma
   - Başarılı performansı hayal etme
   - Teknik detayları görselleştirme

2. **Nefes Teknikleri**
   - Derin nefes alma egzersizleri
   - Stres yönetimi
   - Odaklanma artırma

3. **Rutin Oluşturma**
   - Yarış öncesi rutinler
   - Ritüeller ve alışkanlıklar
   - Güven artırıcı aktiviteler

4. **Pozitif Düşünce**
   - Kendine güven
   - Başarı odaklı düşünce
   - Hata kabulü ve öğrenme

Bu teknikler, kürekçilerin yarış sırasında en iyi performanslarını sergilemelerine yardımcı olur.`,
    author: 'Ayger',
    date: 'February 25, 2025',
    category: 'Psychology',
    readTime: '7 min read'
  },
  {
    id: 'nutrition-rowers',
    title: 'Kürekçiler İçin Optimal Beslenme Rehberi',
    excerpt: 'Kürek sporu, yüksek enerji gerektiren bir aktivitedir ve doğru beslenme, performansı doğrudan etkiler.',
    content: `Kürek sporu, yüksek enerji gerektiren bir aktivitedir ve doğru beslenme, performansı doğrudan etkiler. Kürekçiler için optimal beslenme, hem antrenman hem de yarış dönemlerinde kritik öneme sahiptir.

**Beslenme Prensipleri:**

1. **Karbonhidratlar**
   - Enerji kaynağı olarak karbonhidratlar
   - Kompleks karbonhidratlar
   - Glikojen depolarının doldurulması

2. **Proteinler**
   - Kas onarımı ve gelişimi
   - Yüksek kaliteli protein kaynakları
   - Zamanlama önemli

3. **Yağlar**
   - Sağlıklı yağlar
   - Omega-3 yağ asitleri
   - Enerji metabolizması

4. **Hidrasyon**
   - Su tüketimi
   - Elektrolit dengesi
   - Performans etkisi

**Antrenman Öncesi Beslenme:**
- 2-3 saat önce ana öğün
- Karbonhidrat ağırlıklı
- Hafif ve sindirilebilir

**Antrenman Sonrası Beslenme:**
- 30 dakika içinde protein
- Karbonhidrat takviyesi
- Hidrasyon

Bu beslenme rehberi, kürekçilerin performansını optimize etmelerine yardımcı olur.`,
    author: 'Ayger',
    date: 'February 22, 2025',
    category: 'Nutrition',
    readTime: '9 min read'
  }
];

export function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/ayger/logo.png?v=1" 
                alt="Ayger Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-ayger-navy text-ayger-navy hover:bg-ayger-navy hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            Blog
          </Badge>
          <h1 className="text-5xl font-bold text-ayger-navy mb-6">
            Latest Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest insights, techniques, and innovations in rowing. 
            From equipment guides to training tips, discover everything you need to excel in the sport.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-ayger-navy group-hover:text-ayger-navy/80 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="link" className="p-0 text-ayger-navy hover:text-ayger-navy/80">
                      Continue reading
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-ayger-navy mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to our newsletter for the latest articles, product updates, and rowing insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayger-navy focus:border-transparent"
              />
              <Button className="bg-ayger-navy hover:bg-ayger-navy/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ayger-navy text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/images/ayger/logo.png?v=1" 
                  alt="Ayger Logo" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
                <span className="text-xl font-bold">2025</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SpeedAir</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/product/speedair-pro" className="hover:text-white transition-colors">SpeedAir Pro</Link></li>
                <li><Link to="/product/speedair-coastal" className="hover:text-white transition-colors">SpeedAir Coastal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">RowBill</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/product/rowbill-lite" className="hover:text-white transition-colors">RowBill Lite</Link></li>
                <li><Link to="/product/rowbill-speed" className="hover:text-white transition-colors">RowBill Speed</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>+49 2252 8380180</p>
                <p>ayger.rowing@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'tops' | 'shoes'>('tops');
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const topsData = [
    { size: 'XS', eu: '44', us: '34', uk: '34', asian: 'M', chest: '86-91 سم', waist: '71-76 سم' },
    { size: 'S', eu: '46', us: '36', uk: '36', asian: 'L', chest: '91-96 سم', waist: '76-81 سم' },
    { size: 'M', eu: '48-50', us: '38-40', uk: '38-40', asian: 'XL', chest: '96-102 سم', waist: '81-86 سم' },
    { size: 'L', eu: '52-54', us: '42-44', uk: '42-44', asian: 'XXL', chest: '102-107 سم', waist: '86-92 سم' },
    { size: 'XL', eu: '56', us: '46', uk: '46', asian: '3XL', chest: '107-112 سم', waist: '92-97 سم' },
    { size: 'XXL', eu: '58', us: '48', uk: '48', asian: '4XL', chest: '112-117 سم', waist: '97-102 سم' }
  ];

  const shoesData = [
    { eu: '39', us_men: '6.5', us_women: '8', uk: '6', foot_cm: '24.5 سم' },
    { eu: '40', us_men: '7.5', us_women: '9', uk: '7', foot_cm: '25.0 سم' },
    { eu: '41', us_men: '8.0', us_women: '9.5', uk: '7.5', foot_cm: '26.0 سم' },
    { eu: '42', us_men: '8.5', us_women: '10', uk: '8', foot_cm: '26.5 سم' },
    { eu: '43', us_men: '9.5', us_women: '11', uk: '9', foot_cm: '27.5 سم' },
    { eu: '44', us_men: '10.0', us_women: '11.5', uk: '9.5', foot_cm: '28.0 سم' },
    { eu: '45', us_men: '11.0', us_women: '12.5', uk: '10.5', foot_cm: '29.0 سم' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAr ? 'دليل المقاسات العالمي (Size Guide)' : 'International Size Conversion Guide'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'مقارنة المقاسات الأوروبية، الأمريكية، والآسيوية بدقة لتجنب أخطاء الطلب' : 'Compare EU, US, UK, and Asian sizes accurately'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 my-4 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('tops')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'tops' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'الملابس العلوية والقمصان والبدل' : 'Tops, Shirts & Blazers'}
          </button>
          <button
            onClick={() => setActiveTab('shoes')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'shoes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'الأحذية الرياضية والرسمية' : 'Shoes & Footwear'}
          </button>
        </div>

        {/* Tables */}
        {activeTab === 'tops' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start tabular-nums border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold text-start">{isAr ? 'المقاس العام' : 'Size'}</th>
                  <th className="py-2.5 px-3 font-semibold text-start">EU أوروبا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">US أمريكا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">UK بريطانيا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">Asian آسيا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">{isAr ? 'محيط الصدر' : 'Chest'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topsData.map((row) => (
                  <tr key={row.size} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.size}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.eu}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.us}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.uk}</td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">{row.asian}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.chest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start tabular-nums border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold text-start">EU أوروبا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">US رجالي</th>
                  <th className="py-2.5 px-3 font-semibold text-start">US نسائي</th>
                  <th className="py-2.5 px-3 font-semibold text-start">UK بريطانيا</th>
                  <th className="py-2.5 px-3 font-semibold text-start">{isAr ? 'طول القدم' : 'Foot Length'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shoesData.map((row) => (
                  <tr key={row.eu} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.eu}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.us_men}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.us_women}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.uk}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.foot_cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tip Box */}
        <div className="mt-5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
          <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            {isAr
              ? 'ملاحظة: المقاسات الآسيوية في متاجر مثل AliExpress تكون عادةً أصغر برقم إلى رقمين عن المقاسات الأوروبية. ننصح باختيار مقاس أكبر برتبة عند الشراء من متجر آسيوي.'
              : 'Tip: Asian sizes (AliExpress/CJ) generally run 1-2 sizes smaller than European standard sizes. If in doubt, we recommend choosing one size up.'}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isAr ? 'فهمت ذلك، إغلاق' : 'Got it, Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

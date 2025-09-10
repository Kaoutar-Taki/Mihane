import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Upload, MapPin, User, Briefcase, Phone } from "lucide-react";
import type { OnboardingStep, OnboardingField } from "../../types";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "الأساسيات",
      titleAr: "الأساسيات",
      description: "المعلومات الأساسية لحسابك",
      descriptionAr: "المعلومات الأساسية لحسابك",
      isCompleted: false,
      isRequired: true,
      fields: [
        {
          name: "businessName",
          label: "اسم الورشة/المحل",
          labelAr: "اسم الورشة/المحل",
          type: "text",
          isRequired: true,
          validation: { minLength: 3, maxLength: 50 }
        },
        {
          name: "craftType",
          label: "نوع الحرفة",
          labelAr: "نوع الحرفة",
          type: "select",
          isRequired: true,
          options: [
            { value: "pottery", label: "فخار وخزف", labelAr: "فخار وخزف" },
            { value: "leather", label: "جلود وماروكينري", labelAr: "جلود وماروكينري" },
            { value: "wood", label: "نجارة وخشب", labelAr: "نجارة وخشب" },
            { value: "textile", label: "نسيج وخياطة", labelAr: "نسيج وخياطة" },
            { value: "jewelry", label: "مجوهرات وحلي", labelAr: "مجوهرات وحلي" },
            { value: "metal", label: "حدادة ومعادن", labelAr: "حدادة ومعادن" }
          ]
        },
        {
          name: "city",
          label: "المدينة",
          labelAr: "المدينة",
          type: "select",
          isRequired: true,
          options: [
            { value: "fes", label: "فاس", labelAr: "فاس" },
            { value: "casablanca", label: "الدار البيضاء", labelAr: "الدار البيضاء" },
            { value: "rabat", label: "الرباط", labelAr: "الرباط" },
            { value: "marrakech", label: "مراكش", labelAr: "مراكش" },
            { value: "meknes", label: "مكناس", labelAr: "مكناس" },
            { value: "tetouan", label: "تطوان", labelAr: "تطوان" }
          ]
        },
        {
          name: "avatar",
          label: "صورة شخصية",
          labelAr: "صورة شخصية",
          type: "file",
          isRequired: false,
          validation: { fileTypes: ["image/jpeg", "image/png"], maxFiles: 1 }
        }
      ]
    },
    {
      id: 2,
      title: "التعريف",
      titleAr: "التعريف",
      description: "وصف عملك وخدماتك",
      descriptionAr: "وصف عملك وخدماتك",
      isCompleted: false,
      isRequired: true,
      fields: [
        {
          name: "description",
          label: "وصف مفصل عن عملك",
          labelAr: "وصف مفصل عن عملك",
          type: "textarea",
          isRequired: true,
          validation: { minLength: 50, maxLength: 500 }
        },
        {
          name: "services",
          label: "الخدمات التي تقدمها",
          labelAr: "الخدمات التي تقدمها",
          type: "multiselect",
          isRequired: true,
          options: [
            { value: "custom_orders", label: "طلبات مخصصة", labelAr: "طلبات مخصصة" },
            { value: "repairs", label: "إصلاح وترميم", labelAr: "إصلاح وترميم" },
            { value: "workshops", label: "ورش تعليمية", labelAr: "ورش تعليمية" },
            { value: "consultation", label: "استشارات", labelAr: "استشارات" },
            { value: "delivery", label: "توصيل", labelAr: "توصيل" }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "المعرض",
      titleAr: "المعرض",
      description: "صور أعمالك ومنتجاتك",
      descriptionAr: "صور أعمالك ومنتجاتك",
      isCompleted: false,
      isRequired: true,
      fields: [
        {
          name: "galleryImages",
          label: "صور الأعمال (1-6 صور)",
          labelAr: "صور الأعمال (1-6 صور)",
          type: "file",
          isRequired: true,
          validation: { fileTypes: ["image/jpeg", "image/png"], maxFiles: 6 }
        },
        {
          name: "coverImage",
          label: "صورة الغلاف",
          labelAr: "صورة الغلاف",
          type: "file",
          isRequired: false,
          validation: { fileTypes: ["image/jpeg", "image/png"], maxFiles: 1 }
        }
      ]
    },
    {
      id: 4,
      title: "التواصل والتسعير",
      titleAr: "التواصل والتسعير",
      description: "معلومات التواصل ونطاق الأسعار",
      descriptionAr: "معلومات التواصل ونطاق الأسعار",
      isCompleted: false,
      isRequired: false,
      fields: [
        {
          name: "whatsapp",
          label: "رقم الواتساب",
          labelAr: "رقم الواتساب",
          type: "text",
          isRequired: false,
          validation: { pattern: "^\\+?[1-9]\\d{1,14}$" }
        },
        {
          name: "phone",
          label: "رقم الهاتف",
          labelAr: "رقم الهاتف",
          type: "text",
          isRequired: false,
          validation: { pattern: "^\\+?[1-9]\\d{1,14}$" }
        },
        {
          name: "address",
          label: "العنوان",
          labelAr: "العنوان",
          type: "text",
          isRequired: false
        },
        {
          name: "priceMin",
          label: "أقل سعر (درهم)",
          labelAr: "أقل سعر (درهم)",
          type: "text",
          isRequired: false
        },
        {
          name: "priceMax",
          label: "أعلى سعر (درهم)",
          labelAr: "أعلى سعر (درهم)",
          type: "text",
          isRequired: false
        }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const completionPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  const validateField = (field: OnboardingField, value: any): string | null => {
    if (field.isRequired && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.labelAr} مطلوب`;
    }

    if (field.validation) {
      const validation = field.validation;
      
      if (validation.minLength && value && value.length < validation.minLength) {
        return `${field.labelAr} يجب أن يكون ${validation.minLength} أحرف على الأقل`;
      }
      
      if (validation.maxLength && value && value.length > validation.maxLength) {
        return `${field.labelAr} يجب أن يكون ${validation.maxLength} أحرف كحد أقصى`;
      }
      
      if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
        return `${field.labelAr} غير صحيح`;
      }
    }

    return null;
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    
    currentStepData.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        stepErrors[field.name] = error;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save data to localStorage (in real app, would send to API)
    localStorage.setItem('artisan_onboarding_data', JSON.stringify(formData));
    onComplete();
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const renderField = (field: OnboardingField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.labelAr}
              {field.isRequired && <span className="text-red-500 mr-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.labelAr}
              {field.isRequired && <span className="text-red-500 mr-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.labelAr}
              {field.isRequired && <span className="text-red-500 mr-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            >
              <option value="">اختر...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.labelAr}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.labelAr}
              {field.isRequired && <span className="text-red-500 mr-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value);
                      handleFieldChange(field.name, newValues);
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option.labelAr}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.labelAr}
              {field.isRequired && <span className="text-red-500 mr-1">*</span>}
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
              <input
                type="file"
                multiple={field.validation?.maxFiles !== 1}
                accept={field.validation?.fileTypes?.join(',')}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFieldChange(field.name, files);
                }}
                className="hidden"
                id={field.name}
              />
              <label
                htmlFor={field.name}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 cursor-pointer"
              >
                اختيار ملفات
              </label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <User className="w-5 h-5" />;
      case 1: return <Briefcase className="w-5 h-5" />;
      case 2: return <Upload className="w-5 h-5" />;
      case 3: return <Phone className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إعداد حسابك كحرفي
          </h1>
          <p className="text-gray-600">
            أكمل المعلومات التالية لإنشاء ملفك الشخصي
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-orange-600 border-orange-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    getStepIcon(index)
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-orange-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-600 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {completionPercentage}% مكتمل
          </p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.titleAr}
            </h2>
            <p className="text-gray-600">
              {currentStepData.descriptionAr}
            </p>
          </div>

          <div className="space-y-6">
            {currentStepData.fields.map(renderField)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all"
            >
              {currentStep === steps.length - 1 ? 'إنهاء الإعداد' : 'التالي'}
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

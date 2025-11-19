import React, { useState } from 'react';
import type { FormField } from '../types';

interface FormInteractionProps {
  title: string;
  fields: FormField[];
  submitText?: string;
  vagueValidation?: boolean;
  onComplete: (data: Record<string, string>) => void;
}

// Corporate BS generators for auto-complete
const corporateBSShort = [
  'Per our discussion',
  'As previously mentioned',
  'Following up on this',
  'To align with stakeholders',
  'For visibility and transparency',
  'In accordance with best practices',
  'To drive value creation',
  'Ensuring strategic alignment',
];

const corporateBSLong = [
  'Following our recent discussions, I believe this initiative aligns well with our strategic objectives and will drive significant value for all stakeholders involved. Looking forward to your feedback.',
  'This request is critical to maintaining operational excellence and ensuring we meet our quarterly targets. I have reviewed the necessary documentation and confirm all requirements are satisfied.',
  'In alignment with company policy and our commitment to cross-functional collaboration, I am submitting this form to facilitate the approval process. Please let me know if additional information is required.',
  'Per our conversation during the last sprint planning session, this task requires immediate attention to prevent downstream bottlenecks. I have coordinated with the relevant teams to ensure smooth execution.',
  'This submission reflects our ongoing effort to optimize workflows and enhance productivity across the organization. I appreciate your prompt review and approval of this request.',
];

export const FormInteraction: React.FC<FormInteractionProps> = ({
  title,
  fields,
  submitText = 'Submit',
  vagueValidation = false,
  onComplete,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldId: string) => {
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  const generateRandomCode = (field: FormField): string => {
    // Generate realistic codes based on pattern detection
    const label = (field.label || field.id || '').toLowerCase();

    // Username: firstname.lastname format
    if (label.includes('username') || label.includes('user name')) {
      const firstNames = ['john', 'sarah', 'michael', 'emma', 'david', 'lisa', 'james', 'jennifer', 'robert', 'amy'];
      const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'davis', 'miller', 'wilson', 'moore', 'taylor'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName}.${lastName}`;
    }

    // Manager email address
    if (label.includes('manager') && label.includes('email')) {
      const firstNames = ['robert', 'patricia', 'michael', 'linda', 'william', 'elizabeth', 'david', 'jennifer', 'richard', 'maria'];
      const lastNames = ['anderson', 'thompson', 'martinez', 'robinson', 'clark', 'rodriguez', 'lewis', 'walker', 'hall', 'allen'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName}.${lastName}@company.com`;
    }

    // Employee Number: 5-digit numeric (must come before general employee/staff check)
    if (label.includes('employee') && label.includes('number')) {
      return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Project code: 3-letter acronym
    if (label.includes('project') && label.includes('code')) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    }

    // Staff/Employee ID: alphanumeric
    if (label.includes('staff') || label.includes('employee') || label.includes('emp')) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // Department code: 2-3 letter acronym
    if (label.includes('department') && label.includes('code')) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    }

    // Cost center: numeric
    if (label.includes('cost') && label.includes('center')) {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // ID number: numeric
    if (label.includes('id') && label.includes('number')) {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Reference number: mix
    if (label.includes('reference') || label.includes('ref')) {
      return `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    return '';
  };

  const autoFillField = (field: FormField) => {
    let value = '';

    // Try smart field detection first
    const smartValue = generateRandomCode(field);
    if (smartValue) {
      value = smartValue;
    } else if (field.type === 'textarea' || (field.minLength && field.minLength > 30)) {
      // Long text - use corporate BS
      value = corporateBSLong[Math.floor(Math.random() * corporateBSLong.length)];
    } else if (field.type === 'text') {
      // Short text - use short BS
      value = corporateBSShort[Math.floor(Math.random() * corporateBSShort.length)];
    }

    handleChange(field.id, value);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.id] || '';

      if (field.required && !value.trim()) {
        newErrors[field.id] = vagueValidation
          ? 'This field is invalid'
          : field.validationMessage || 'This field is required';
      } else if (field.minLength && value.length < field.minLength) {
        newErrors[field.id] = vagueValidation
          ? 'Invalid input'
          : `Minimum ${field.minLength} characters required`;
      } else if (field.maxLength && value.length > field.maxLength) {
        newErrors[field.id] = vagueValidation
          ? 'Input too long'
          : `Maximum ${field.maxLength} characters allowed`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      allTouched[field.id] = true;
    });
    setTouched(allTouched);

    if (validate()) {
      onComplete(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.id}
            checked={value === 'true'}
            onChange={(e) => handleChange(field.id, e.target.checked.toString())}
            onBlur={() => handleBlur(field.id)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      default: // text
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="form-interaction">
      <h3>{title}</h3>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className={`form-field ${field.type === 'checkbox' ? 'checkbox-field' : ''}`}>
            <div className="field-header">
              <label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>

              {/* Auto-complete button for text/textarea fields */}
              {/* Show if: smart detection works OR it's a regular text field */}
              {(field.type === 'text' || field.type === 'textarea') &&
               (generateRandomCode(field) || field.type === 'textarea') && (
                <button
                  type="button"
                  onClick={() => autoFillField(field)}
                  className="auto-fill-btn"
                  title="Auto-fill with corporate language"
                >
                  Auto-fill
                </button>
              )}
            </div>

            {renderField(field)}

            {field.helperText && (
              <p className="helper-text">{field.helperText}</p>
            )}

            {touched[field.id] && errors[field.id] && (
              <p className="error-text">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <button type="submit" className="submit-btn">
          {submitText}
        </button>
      </form>

      <style>{`
        .form-interaction {
          padding: 1rem;
        }

        @media (min-width: 640px) {
          .form-interaction {
            padding: 1.5rem;
          }
        }

        .form-interaction h3 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        @media (min-width: 640px) {
          .form-interaction h3 {
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
          }
        }

        .form-field {
          margin-bottom: 1rem;
        }

        @media (min-width: 640px) {
          .form-field {
            margin-bottom: 1.25rem;
          }
        }

        .form-field.checkbox-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-field.checkbox-field label {
          margin-bottom: 0;
          order: 2;
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
          gap: 0.5rem;
        }

        .form-field label {
          display: block;
          font-weight: 500;
          font-size: 0.85rem;
          margin: 0;
        }

        @media (min-width: 640px) {
          .form-field label {
            font-size: 0.9rem;
          }
        }

        .auto-fill-btn {
          padding: 0.25rem 0.5rem;
          background: #f0f0f0;
          color: #666;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        @media (min-width: 640px) {
          .auto-fill-btn {
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        .auto-fill-btn:hover {
          background: #e0e0e0;
          color: #333;
          border-color: #ccc;
        }

        .form-field .required {
          color: #ff4444;
          margin-left: 0.2rem;
        }

        .form-field input,
        .form-field textarea,
        .form-field select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: inherit;
        }

        @media (min-width: 640px) {
          .form-field input,
          .form-field textarea,
          .form-field select {
            padding: 0.6rem;
            font-size: 0.9rem;
          }
        }

        .form-field.checkbox-field input {
          width: auto;
        }

        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .helper-text {
          margin-top: 0.3rem;
          font-size: 0.75rem;
          color: #666;
          font-style: italic;
        }

        @media (min-width: 640px) {
          .helper-text {
            font-size: 0.8rem;
          }
        }

        .error-text {
          margin-top: 0.3rem;
          font-size: 0.75rem;
          color: #ff4444;
        }

        @media (min-width: 640px) {
          .error-text {
            font-size: 0.8rem;
          }
        }

        .submit-btn {
          margin-top: 1rem;
          padding: 0.6rem 1.5rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.95rem;
          width: 100%;
        }

        @media (min-width: 640px) {
          .submit-btn {
            font-size: 1rem;
          }
        }

        .submit-btn:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};

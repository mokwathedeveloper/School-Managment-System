export type TemplateType = 
  | 'ABSENCE_ALERT' 
  | 'FEE_INVOICE' 
  | 'EXAM_RESULT' 
  | 'ADMISSION_WELCOME' 
  | 'PASSWORD_RESET';

const TEMPLATES: Record<TemplateType, { subject: string, body: string }> = {
  ABSENCE_ALERT: {
    subject: 'Absence Notification',
    body: 'Dear Parent, your child {{student_name}} was marked ABSENT today, {{date}}. Please contact the administration if this was unplanned.'
  },
  FEE_INVOICE: {
    subject: 'New Fee Invoice',
    body: 'Hello {{name}}, a new invoice for {{amount}} has been generated for {{student_name}}. Reference: {{invoice_id}}. Due date: {{due_date}}.'
  },
  EXAM_RESULT: {
    subject: 'Exam Results Released',
    body: 'Dear {{name}}, the results for {{exam_name}} have been released. {{student_name}} scored {{marks}}% (Grade: {{grade}}).'
  },
  ADMISSION_WELCOME: {
    subject: 'Welcome to {{school_name}}',
    body: 'Dear {{name}}, we are pleased to inform you that {{student_name}}\'s application for admission has been APPROVED. Please visit the portal to complete onboarding.'
  },
  PASSWORD_RESET: {
    subject: 'Reset Your Password',
    body: 'Hello {{name}}, use the following code to reset your account password: {{code}}. If you did not request this, please ignore.'
  }
};

export const TemplateService = {
  render(type: TemplateType, data: Record<string, string | number>) {
    const template = TEMPLATES[type];
    if (!template) throw new Error(`Template ${type} not found`);

    let renderedBody = template.body;
    let renderedSubject = template.subject;

    Object.entries(data).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      renderedBody = renderedBody.replace(placeholder, String(value));
      renderedSubject = renderedSubject.replace(placeholder, String(value));
    });

    return {
      subject: renderedSubject,
      body: renderedBody
    };
  }
};

angular.module 'guclinkCommon'
  .constant 'GUC_ID_REGEX', /^([0-9]+)-([0-9]+)$/
  .constant 'GUC_EMAIL_REGEX', /^[a-zA-Z\.\-]+@(student.)?guc.edu.eg$/
  .constant 'STUDENT_EMAIL_REGEX', /^[a-zA-Z\.\-]+@student.guc.edu.eg$/
  .constant 'defaultPageSize', 15

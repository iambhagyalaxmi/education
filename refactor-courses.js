const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/admin/AdminCourses.tsx', 'utf8');

// 1. Remove the modals from inside renderCourseList
const courseModalMatch = content.match(/\{\/\* Add Course Modal \*\/\}(.|\n)*?(?=\{\/\* Add Batch Modal \*\/\})/m)[0];
const batchModalMatch = content.match(/\{\/\* Add Batch Modal \*\/\}(.|\n)*?(?=\n    <\/div>\n  \);\n\n  const renderBatchManagement)/m)[0];

// Remove them from renderCourseList
content = content.replace(courseModalMatch, '');
content = content.replace(batchModalMatch, '');

// Also remove the Subject modal that I appended earlier if it exists inside there (it doesn't, it was appended before switch)
const subjectModalMatch = content.match(/\{\/\* Add Subject Modal \*\/\}(.|\n)*?(?=switch \(activeTab\))/m);
let subjectModal = '';
if (subjectModalMatch) {
  subjectModal = subjectModalMatch[0];
  content = content.replace(subjectModalMatch[0], '');
}

// 2. Change the final switch statement to return a master div containing the success message, modals, and the switched content.

// Extract the success message from renderCourseList so it can be in the master div
const successMatch = content.match(/\{success && \((.|\n)*?\)\}/m);
let successMessage = '';
if (successMatch) {
  successMessage = successMatch[0];
  content = content.replace(successMessage, '');
}

const switchBlock = `
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      ${successMessage}

      ${courseModalMatch}
      ${batchModalMatch}
      ${subjectModal}

      {(() => {
        switch (activeTab) {
          case 'courses-batches':
            return renderBatchManagement();
          case 'courses-subjects':
            return renderSubjectsManagement();
          case 'courses-list':
          default:
            return renderCourseList();
        }
      })()}
    </div>
  );
`;

content = content.replace(/  switch \(activeTab\) \{[\s\S]*\}\n\}\n*$/, switchBlock + "\n}\n");

fs.writeFileSync('frontend/src/components/admin/AdminCourses.tsx', content);

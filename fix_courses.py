import re

with open('frontend/src/components/admin/AdminCourses.tsx', 'r') as f:
    content = f.read()

# The goal is to move the modals and success message out of renderCourseList,
# and put them in a wrapper div in the main return.

# 1. Find the success message in renderCourseList
success_match = re.search(r'(\s*\{success && \(\s*<div.*?</div>\s*\)\})', content, re.DOTALL)
success_msg = success_match.group(1) if success_match else ''

# 2. Find Add Course Modal
course_modal_match = re.search(r'(\s*\{\/\* Add Course Modal \*\/\}.*?\{\/\* Add Batch Modal \*\/\})', content, re.DOTALL)
course_modal = course_modal_match.group(1).replace('{/* Add Batch Modal */}', '') if course_modal_match else ''

# 3. Find Add Batch Modal
batch_modal_match = re.search(r'(\s*\{\/\* Add Batch Modal \*\/\}.*?\n      \})\n    </div>\n  \);\n\n  const renderBatchManagement', content, re.DOTALL)
batch_modal = batch_modal_match.group(1) if batch_modal_match else ''

# 4. Find Add Subject Modal
subject_modal_match = re.search(r'(\s*\{\/\* Add Subject Modal \*\/\}.*?)\s*\{\(\(\) => \{', content, re.DOTALL)
subject_modal = subject_modal_match.group(1) if subject_modal_match else ''

# 5. Remove them from their current places
if success_msg: content = content.replace(success_msg, '')
if course_modal: content = content.replace(course_modal, '')
if batch_modal: content = content.replace(batch_modal, '')
if subject_modal: content = content.replace(subject_modal, '')

# 6. Replace the old switch block
old_switch = re.search(r'\s*\{\(\(\) => \{\n\s*switch \(activeTab\) \{.*?\n\s*\}\n\s*\}\)\(\)\}', content, re.DOTALL)
if old_switch:
    content = content.replace(old_switch.group(0), '')
else:
    old_switch2 = re.search(r'\s*switch \(activeTab\) \{.*?\n\s*\}\n\}\n*$', content, re.DOTALL)
    if old_switch2:
        content = content.replace(old_switch2.group(0), '\n}\n')

# 7. Construct new switch block and main return
new_end = f"""
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
{success_msg}
{course_modal}
{batch_modal}
{subject_modal}
      {{(() => {{
        switch (activeTab) {{
          case 'courses-batches':
            return renderBatchManagement();
          case 'courses-subjects':
            return renderSubjectsManagement();
          case 'courses-list':
          default:
            return renderCourseList();
        }}
      }})()}}
    </div>
  );
}}
"""

# Replace the end brace with the new_end
content = re.sub(r'\}\n*$', new_end, content)

# 8. RenderCourseList needs to return just its inner content without the master div wrapper, but wait, we can just leave it returning a div.
# Wait, if renderCourseList returns a div, and we wrap it in another div, that's totally fine.

with open('frontend/src/components/admin/AdminCourses.tsx', 'w') as f:
    f.write(content)

const fs = require('fs');
const path = require('path');

const files = [
  'AdminCategories.js',
  'AdminEvents.js',
  'AdminMenu.js',
  'AdminMenuPanels.js',
  'AdminPress.js',
  'AdminSetMenus.js'
];

const dir = path.join(__dirname, '../frontend/src/components/Admin');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the select block for language
  const selectRegex = /(<select[^>]*value=\{formData\.lang\}[^>]*>[\s\S]*?<\/select>)/g;
  
  content = content.replace(selectRegex, (match) => {
    if (match.includes('langBoth')) return match; // already injected

    let onChangeStr = `(e) => setFormData({ ...formData, lang: e.target.checked ? 'BOTH' : 'VN' })`;
    if (file === 'AdminMenu.js') {
      onChangeStr = `(e) => handleLangChange(e.target.checked ? 'BOTH' : 'VN')`;
    }

    const checkboxHtml = `
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="langBoth" 
                    checked={formData.lang === 'BOTH'}
                    onChange={${onChangeStr}}
                  />
                  <label htmlFor="langBoth" style={{ margin: 0, fontWeight: 'normal' }}>Hiển thị cho cả 2 ngôn ngữ</label>
                </div>`;
                
    // We also need to add <option value="BOTH"> BOTH to the select itself to avoid empty display if formData.lang is BOTH but select has no BOTH option
    let modifiedSelect = match.replace('</select>', '  <option value="BOTH">Cả hai (Tiếng Việt & Tiếng Anh)</option>\n                </select>');
    
    return modifiedSelect + checkboxHtml;
  });

  // Handle the table display "BOTH"
  const langDisplayRegex = /<td>\{item\.lang\}<\/td>/g;
  content = content.replace(langDisplayRegex, `<td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>`);

  // Handle AdminMenu.js categories filter
  if (file === 'AdminMenu.js') {
    content = content.replace(
      `const categoriesForLang = categories.filter((c) => c.lang === formData.lang);`,
      `const categoriesForLang = formData.lang === 'BOTH' ? categories : categories.filter((c) => c.lang === formData.lang || c.lang === 'BOTH');`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

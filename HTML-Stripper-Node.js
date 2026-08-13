const fs = require('fs');
const path = require('path');

// 📂 Define the target JSON files to process
const filesToProcess = ['raw-data/gemini_raw-data.json', 'raw-data/ai-mode_raw-data.json', 'showcase/sample-data.json'];

console.log('🚀 Initializing Sovereignty-COS Native JSON Parser (v4.1 - The Architect Edition & Garbage Collection & Table Preservation )...');

filesToProcess.forEach((fileName) => {
    console.log('\n======================================================');
    console.log(`🎯 Target Locked: ${fileName}`);
    
    // Resolve the exact input path based on the folder structure
    const inputFile = path.join(__dirname, fileName);

    // Output will be a beautiful, readable text script
    /*const outputFileName = `clean_${fileName.replace('.json', '.txt')}`;
    const outputFile = path.join(__dirname, outputFileName);  */

    // 🧠 SMART ROUTING: Extract folder, name, and extension
    const parsedPath = path.parse(inputFile); 
    // Create output file IN THE SAME FOLDER with "clean_" prefix
    const outputFile = path.join(parsedPath.dir, `clean_${parsedPath.name}.txt`);

    try {
        if (!fs.existsSync(inputFile)) {
            console.log(`⚠️ WARNING: Target file ${fileName} not found. Check your folder names! Skipping...`);
            return;
        }

        // 1. READ THE FILE
        const rawData = fs.readFileSync(inputFile, 'utf8');

        // 2. THE ARCHITECT'S MOVE: Parse as Native JSON!
        // This AUTOMATICALLY and flawlessly decodes all \u003c, \n, and \u0026quot;
        const parsedJSON = JSON.parse(rawData);

        let formattedScript = '';

        // 3. Process each conversation block perfectly
        parsedJSON.forEach((block) => {
            // Extract Date
            const date = block.time || 'Unknown Date';
            
            // Extract User Prompt (Remove Google's auto-generated "Prompted " prefix)
            let userPrompt = block.title || '';
            if (userPrompt.startsWith('Prompted ')) {
                userPrompt = userPrompt.substring(9); 
            }

            // Extract AI Response from the safeHtmlItem array
            let aiResponse = '';
            if (block.safeHtmlItem && block.safeHtmlItem.length > 0) {
                aiResponse = block.safeHtmlItem[0].html || '';
            }

        // 4. STRIP HTML AND PROTECT CODE (Now that \u003c is actually <)
            let cleanAIResponse = aiResponse;
            const codeVault = [];
            
            // Protect markdown code blocks
            cleanAIResponse = cleanAIResponse.replace(/```[\s\S]*?```/g, (match) => {
                codeVault.push(match);
                return `___CODE_VAULT_${codeVault.length - 1}___`;
            });

            // 🏛️ THE ARCHITECT'S TABLE PRESERVATION:
            // Convert HTML table rows to new lines, and table cells to " | " separators
            cleanAIResponse = cleanAIResponse.replace(/<\/tr>/gi, '\n');
            cleanAIResponse = cleanAIResponse.replace(/<\/td>|<\/th>/gi, ' | ');

            // Strip HTML and decode entities natively
            cleanAIResponse = cleanAIResponse.replace(/<[^>]+>/g, '');

            // Convert HTML entities (like &quot;) to actual characters
            const htmlEntities = { '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&nbsp;': ' ' };
            cleanAIResponse = cleanAIResponse.replace(/&[a-zA-Z0-9#]+;/g, (match) => htmlEntities[match] || match);

            // Restore code blocks from the vault
            codeVault.forEach((vaultCode, index) => {
                cleanAIResponse = cleanAIResponse.replace(`___CODE_VAULT_${index}___`, vaultCode);
            });

            // 🧹 GARBAGE COLLECTION: Clean up excessive whitespace (The 10-line gap fix)
            // If there are 3 or more consecutive new lines (\n), squash them into exactly 2!
            cleanAIResponse = cleanAIResponse.replace(/\n{3,}/g, '\n\n');

        // 5. BUILD THE BEAUTIFUL TEXT SCRIPT FOR NotebookLM
            formattedScript += `\n======================================================\n`;
            formattedScript += `📅 DATE: ${date}\n`;
            formattedScript += `👤 CAPITANA MayBells: ${userPrompt}\n\n`;
            formattedScript += `🤖 SOVEREIGNTY Cognitive Partner:\n${cleanAIResponse.trim()}\n`;
        });

        // Write the completely transformed, human-readable text to file
        fs.writeFileSync(outputFile, formattedScript);
        
        console.log(`✅ OPERATION SUCCESSFUL: ${parsedPath.name} cleaned and saved to its folder!`);
        
    } catch (err) {
        console.error(`❌ ERROR: An issue occurred processing ${fileName}. Is it valid JSON?`, err);
    }
});

console.log('\n🏁 All operations completed successfully. The Matrix has been decoded. Zero Friction!');
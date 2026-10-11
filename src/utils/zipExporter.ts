// Utility to package and download the complete C# ASP.NET Core 10 Solution and Angular 19 Project as ZIP archives
import JSZip from 'jszip';
import { csharpSolutionFiles } from '../csharp-solution/solutionFiles.js';
import { angularSolutionFiles } from '../angular-solution/angularFiles.js';

export async function exportSolutionZip(): Promise<void> {
  const zip = new JSZip();

  // Root folder
  const root = zip.folder('OMPolymer.Backend');

  if (!root) {
    throw new Error('Failed to initialize zip archive');
  }

  // Add all solution files
  for (const file of csharpSolutionFiles) {
    root.file(file.path, file.content);
  }

  // Add a README.md for the user
  const readmeContent = `# OM Polymer — ASP.NET Core 10 Web API Backend

## Quick Start Instructions

### Prerequisites
1. .NET 10 SDK (or .NET 8 / 9 LTS) installed: \`dotnet --version\`
2. Microsoft SQL Server (Developer Edition, Express, or LocalDB)
3. SQL Server Management Studio (SSMS) or Azure Data Studio

### Step 1: Database Setup
1. Open SSMS and connect to your SQL Server instance.
2. Open \`Database/OMPolymerDB.sql\`.
3. Execute the script to create the database, tables, relationships, indexes, and initial seed data.

### Step 2: Configure Connection String
Open \`OMPolymer.API/appsettings.json\` and ensure \`DefaultConnection\` matches your SQL Server instance:
\`\`\`json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=OMPolymerDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
\`\`\`

### Step 3: Run the API
\`\`\`bash
cd OMPolymer.API
dotnet restore
dotnet run
\`\`\`

Open your browser to:
- Swagger UI: \`https://localhost:7001/swagger\` or \`http://localhost:5000/swagger\`

### Default Admin Credentials
- Email: \`admin@ompolymer.com\`
- Password: \`Admin@123\`
`;

  root.file('README.md', readmeContent);

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'OMPolymer_DotNet10_Solution.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function exportAngularZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('om-polymer-angular');

  if (!root) {
    throw new Error('Failed to initialize zip archive');
  }

  for (const file of angularSolutionFiles) {
    root.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'OMPolymer_Angular19_Solution.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function exportFullStackZip(): Promise<void> {
  const zip = new JSZip();
  
  const backend = zip.folder('OMPolymer.Backend');
  if (backend) {
    for (const file of csharpSolutionFiles) {
      backend.file(file.path, file.content);
    }
  }

  const frontend = zip.folder('OMPolymer.Frontend.Angular');
  if (frontend) {
    for (const file of angularSolutionFiles) {
      frontend.file(file.path, file.content);
    }
  }

  const rootReadme = `# OM Polymer Full-Stack Solution (.NET 10 + Angular 19)

Contains:
1. \`OMPolymer.Backend\`: ASP.NET Core 10 Web API, Entity Framework Core Database-First, JWT Bearer Auth, Rate Limiting, SQL Server Scripts.
2. \`OMPolymer.Frontend.Angular\`: Angular 19 LTS Standalone Frontend, Tailwind CSS, Reactive Forms, Signals, Functional Interceptors.

### To Run Backend:
\`\`\`bash
cd OMPolymer.Backend/OMPolymer.API
dotnet restore
dotnet run
\`\`\`

### To Run Angular Frontend:
\`\`\`bash
cd OMPolymer.Frontend.Angular
npm install
npm start
\`\`\`
`;
  zip.file('README.md', rootReadme);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'OMPolymer_FullStack_DotNet10_Angular19.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}


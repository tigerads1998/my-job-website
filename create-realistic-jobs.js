const { createClient } = require('@supabase/supabase-js');

async function createRealisticJobs() {
  console.log('💼 CREATING REALISTIC JOB DESCRIPTIONS LIKE INDEED.COM...\n');
  
  const supabase = createClient(
    'http://localhost:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  );
  
  // Realistic startup company names
  const startupCompanies = [
    'TechVision Inc', 'DataFlow Solutions', 'CloudBridge Technologies', 'InnovateLab Corp', 
    'PixelCraft Studios', 'CodeWave Systems', 'ByteForge Technologies', 'QuantumLeap AI',
    'NeuralNet Dynamics', 'CyberShield Security', 'AlgoMind Technologies', 'FlexiTech Solutions',
    'SmartGrid Analytics', 'VelocityAI Labs', 'NextGen Software', 'FutureSync Technologies',
    'ProtoType Innovations', 'AgileCore Systems', 'ZenithTech Solutions', 'PulseDigital Media',
    'EvoSoft Technologies', 'TurboCode Labs', 'MegaByte Systems', 'UltraLogic Solutions',
    'HyperLink Networks', 'MetaVerse Studios', 'CrystalCode Technologies', 'ThunderTech Labs',
    'LightSpeed Computing', 'RocketLab Innovations', 'StarBurst Technologies', 'OmegaTech Solutions',
    'AlphaCode Systems', 'BetaLabs Technologies', 'GammaWorks Inc', 'DeltaForce Security',
    'EpsilonAI Solutions', 'ZetaCore Technologies', 'EtaLogic Systems', 'ThetaFlow Analytics',
    'IotaLabs Inc', 'KappaTech Solutions', 'LambdaCode Technologies', 'MuSoft Systems',
    'NuLogic Analytics', 'XiFlow Technologies', 'OmicronAI Labs', 'PiLabs Solutions',
    'RhoTech Systems', 'SigmaCode Technologies', 'TauLogic Solutions', 'UpsilonAI Inc',
    'PhiLabs Technologies', 'ChiTech Solutions', 'PsiCode Systems', 'OmegaFlow Analytics',
    'FlashTech Solutions', 'SparkLabs Technologies', 'BoltCode Systems', 'StormTech Inc',
    'WindFlow Analytics', 'FireLabs Technologies', 'IceTech Solutions', 'WaveCode Systems',
    'SkyTech Analytics', 'StarFlow Technologies', 'MoonLabs Solutions', 'SunTech Systems',
    'CosmosCode Technologies', 'GalaxyFlow Analytics', 'UniverseTech Solutions', 'QuantumCode Labs',
    'AtomicLabs Technologies', 'MolecularTech Solutions', 'CellularCode Systems', 'BiologicFlow Inc',
    'GeneticLabs Technologies', 'DNATech Solutions', 'RNACode Systems', 'ProteinFlow Analytics',
    'EnzymeLabs Technologies', 'VitaminTech Solutions', 'MineralCode Systems', 'NutriFlow Inc',
    'HealthLabs Technologies', 'MediTech Solutions', 'CureCode Systems', 'HealFlow Analytics',
    'WellnessLabs Technologies', 'FitTech Solutions', 'ActiveCode Systems', 'SportFlow Inc'
  ];
  
  // Realistic job templates based on Indeed format
  const jobTemplates = [
    {
      title: 'Full Stack Developer',
      overview: 'We are seeking a talented Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies.',
      responsibilities: [
        'Develop and maintain web applications using React, Node.js, and modern frameworks',
        'Collaborate with cross-functional teams to define, design, and ship new features',
        'Write clean, maintainable, and efficient code',
        'Participate in code reviews and maintain coding standards',
        'Troubleshoot and debug applications',
        'Stay up-to-date with emerging technologies and industry trends'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of experience in full stack development',
        'Proficiency in JavaScript, React, Node.js, and SQL databases',
        'Experience with RESTful APIs and microservices architecture',
        'Knowledge of version control systems (Git)',
        'Strong problem-solving skills and attention to detail'
      ],
      preferred: [
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Knowledge of containerization (Docker, Kubernetes)',
        'Experience with CI/CD pipelines',
        'Familiarity with Agile development methodologies'
      ]
    },
    {
      title: 'Data Scientist',
      overview: 'Join our data science team to help drive business insights through advanced analytics and machine learning. You will work with large datasets to solve complex business problems.',
      responsibilities: [
        'Analyze large datasets to identify trends, patterns, and insights',
        'Develop and implement machine learning models and algorithms',
        'Create data visualizations and reports for stakeholders',
        'Collaborate with business teams to understand requirements',
        'Clean and preprocess data for analysis',
        'Present findings to technical and non-technical audiences'
      ],
      requirements: [
        'Master\'s degree in Data Science, Statistics, or related field',
        '2+ years of experience in data science or analytics',
        'Proficiency in Python, R, and SQL',
        'Experience with machine learning libraries (scikit-learn, TensorFlow, PyTorch)',
        'Strong statistical analysis and modeling skills',
        'Experience with data visualization tools (Tableau, Power BI, or similar)'
      ],
      preferred: [
        'PhD in quantitative field',
        'Experience with big data technologies (Spark, Hadoop)',
        'Knowledge of cloud-based ML platforms',
        'Experience in A/B testing and experimental design'
      ]
    },
    {
      title: 'UX/UI Designer',
      overview: 'We are looking for a creative UX/UI Designer to enhance user experience across our digital products. You will be responsible for creating intuitive and visually appealing interfaces.',
      responsibilities: [
        'Design user interfaces for web and mobile applications',
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and mockups',
        'Collaborate with developers to ensure design implementation',
        'Maintain design systems and style guides',
        'Stay current with design trends and best practices'
      ],
      requirements: [
        'Bachelor\'s degree in Design, HCI, or related field',
        '3+ years of UX/UI design experience',
        'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
        'Strong portfolio demonstrating design process and outcomes',
        'Understanding of user-centered design principles',
        'Experience with responsive and mobile-first design'
      ],
      preferred: [
        'Experience with prototyping tools (InVision, Principle)',
        'Knowledge of HTML/CSS and front-end development',
        'Experience conducting user interviews and usability tests',
        'Familiarity with accessibility standards (WCAG)'
      ]
    },
    {
      title: 'DevOps Engineer',
      overview: 'Join our infrastructure team as a DevOps Engineer to help scale our systems and improve deployment processes. You will work on automation, monitoring, and cloud infrastructure.',
      responsibilities: [
        'Design and maintain CI/CD pipelines',
        'Manage cloud infrastructure on AWS/Azure/GCP',
        'Implement monitoring and alerting systems',
        'Automate deployment and scaling processes',
        'Ensure system security and compliance',
        'Collaborate with development teams on infrastructure needs'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of DevOps or system administration experience',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Proficiency in scripting languages (Python, Bash, PowerShell)',
        'Knowledge of containerization (Docker, Kubernetes)',
        'Experience with infrastructure as code (Terraform, CloudFormation)'
      ],
      preferred: [
        'Certifications in cloud platforms',
        'Experience with monitoring tools (Prometheus, Grafana, ELK stack)',
        'Knowledge of security best practices',
        'Experience with microservices architecture'
      ]
    },
    {
      title: 'Product Manager',
      overview: 'We are seeking an experienced Product Manager to drive product strategy and work with cross-functional teams to deliver exceptional user experiences.',
      responsibilities: [
        'Define product strategy and roadmap',
        'Gather and prioritize product requirements',
        'Work closely with engineering and design teams',
        'Analyze market trends and competitive landscape',
        'Manage product launches and go-to-market strategies',
        'Track product metrics and user feedback'
      ],
      requirements: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        '4+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with product management tools (Jira, Confluence, etc.)',
        'Excellent communication and leadership skills',
        'Understanding of software development lifecycle'
      ],
      preferred: [
        'MBA or advanced degree',
        'Experience in B2B or SaaS products',
        'Technical background or engineering experience',
        'Experience with data analytics tools'
      ]
    },
    {
      title: 'Mobile Developer',
      overview: 'Join our mobile team to build cutting-edge iOS and Android applications. You will work on feature development, performance optimization, and user experience improvements.',
      responsibilities: [
        'Develop native mobile applications for iOS and Android',
        'Collaborate with designers to implement UI/UX designs',
        'Optimize applications for performance and scalability',
        'Integrate with APIs and third-party services',
        'Write unit tests and maintain code quality',
        'Stay updated with mobile development trends'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of mobile development experience',
        'Proficiency in Swift/Objective-C (iOS) or Kotlin/Java (Android)',
        'Experience with mobile development frameworks',
        'Knowledge of RESTful APIs and JSON',
        'Understanding of mobile UI/UX principles'
      ],
      preferred: [
        'Experience with cross-platform frameworks (React Native, Flutter)',
        'Knowledge of mobile testing frameworks',
        'Experience with app store deployment processes',
        'Understanding of mobile security best practices'
      ]
    },
    {
      title: 'Software Engineer',
      overview: 'We are looking for a skilled Software Engineer to join our development team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
      responsibilities: [
        'Design and develop software applications',
        'Write clean, efficient, and maintainable code',
        'Participate in code reviews and technical discussions',
        'Collaborate with team members on project requirements',
        'Debug and resolve technical issues',
        'Contribute to software architecture decisions'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '2+ years of software development experience',
        'Proficiency in one or more programming languages (Java, Python, C#, etc.)',
        'Understanding of software development principles',
        'Experience with version control systems',
        'Strong problem-solving and analytical skills'
      ],
      preferred: [
        'Experience with cloud technologies',
        'Knowledge of database systems',
        'Familiarity with Agile methodologies',
        'Open source contributions'
      ]
    },
    {
      title: 'Frontend Developer',
      overview: 'Join our frontend team to create engaging user interfaces and exceptional web experiences. You will work with modern JavaScript frameworks and cutting-edge technologies.',
      responsibilities: [
        'Develop responsive web applications using modern frameworks',
        'Implement pixel-perfect designs from mockups',
        'Optimize applications for speed and scalability',
        'Collaborate with backend developers on API integration',
        'Ensure cross-browser compatibility',
        'Maintain and improve existing codebases'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of frontend development experience',
        'Proficiency in HTML, CSS, JavaScript, and modern frameworks (React, Vue, Angular)',
        'Experience with responsive design and CSS preprocessors',
        'Knowledge of build tools and package managers',
        'Understanding of web performance optimization'
      ],
      preferred: [
        'Experience with TypeScript',
        'Knowledge of testing frameworks (Jest, Cypress)',
        'Familiarity with design systems',
        'Experience with progressive web apps (PWAs)'
      ]
    },
    {
      title: 'Backend Developer',
      overview: 'We are seeking a Backend Developer to build and maintain server-side applications and APIs. You will work on scalable systems that power our products.',
      responsibilities: [
        'Design and develop RESTful APIs and microservices',
        'Build scalable backend systems and databases',
        'Implement security best practices',
        'Optimize database queries and system performance',
        'Integrate with third-party services and APIs',
        'Monitor and maintain production systems'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of backend development experience',
        'Proficiency in server-side languages (Python, Java, Node.js, etc.)',
        'Experience with databases (SQL and NoSQL)',
        'Knowledge of API design and development',
        'Understanding of system architecture and design patterns'
      ],
      preferred: [
        'Experience with cloud platforms and services',
        'Knowledge of caching strategies (Redis, Memcached)',
        'Experience with message queues and event-driven architecture',
        'Familiarity with containerization and orchestration'
      ]
    },
    {
      title: 'QA Engineer',
      overview: 'Join our quality assurance team to ensure our products meet the highest standards. You will be responsible for testing, automation, and quality processes.',
      responsibilities: [
        'Design and execute test plans and test cases',
        'Perform manual and automated testing',
        'Identify, document, and track bugs',
        'Collaborate with development teams on quality issues',
        'Develop and maintain test automation frameworks',
        'Participate in release planning and deployment processes'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '2+ years of QA or testing experience',
        'Experience with manual and automated testing',
        'Knowledge of testing methodologies and best practices',
        'Familiarity with bug tracking tools',
        'Strong attention to detail and analytical skills'
      ],
      preferred: [
        'Experience with test automation tools (Selenium, Cypress)',
        'Knowledge of performance testing',
        'Experience with API testing',
        'Familiarity with CI/CD processes'
      ]
    }
  ];
  
  // Work locations and details
  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
    'Denver, CO', 'Miami, FL', 'Chicago, IL', 'Los Angeles, CA', 'Portland, OR',
    'Atlanta, GA', 'Dallas, TX', 'Phoenix, AZ', 'San Diego, CA', 'Nashville, TN'
  ];
  
  const workModels = ['Remote', 'Hybrid', 'On-site'];
  const jobTypes = ['full-time', 'part-time', 'contract'];
  
  // Benefits packages
  const benefitsPackages = [
    [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible PTO and holidays',
      'Professional development budget',
      'Remote work flexibility'
    ],
    [
      'Comprehensive health benefits',
      '401(k) with company matching',
      'Flexible working hours',
      'Learning and development opportunities',
      'Catered meals and snacks'
    ],
    [
      'Medical, dental, and vision coverage',
      'Unlimited vacation policy',
      'Stock options',
      'Gym membership reimbursement',
      'Work from home stipend'
    ]
  ];
  
  try {
    // Get all jobs
    console.log('🔍 Fetching all jobs...');
    const { data: jobs, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, company, location, type');
    
    if (fetchError) {
      console.log('❌ Error fetching jobs:', fetchError.message);
      return;
    }
    
    console.log(`📁 Found ${jobs.length} jobs to recreate with realistic content`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      
      try {
        // Pick random elements
        const randomCompany = startupCompanies[Math.floor(Math.random() * startupCompanies.length)];
        const randomTemplate = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomWorkModel = workModels[Math.floor(Math.random() * workModels.length)];
        const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
        const randomBenefits = benefitsPackages[Math.floor(Math.random() * benefitsPackages.length)];
        
        // Create realistic job description
        const realisticDescription = `<div class="job-description" style="line-height: 1.5; font-family: Arial, sans-serif;">
<h2 style="margin: 0 0 16px 0; font-size: 1.4rem; color: #2d3748;">${randomTemplate.title}</h2>

<div style="margin-bottom: 20px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">About the Role</h3>
<p style="margin: 0 0 12px 0; color: #2d3748;">${randomTemplate.overview}</p>
</div>

<div style="margin-bottom: 20px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">Key Responsibilities</h3>
<ul style="margin: 0; padding-left: 20px; color: #2d3748;">
${randomTemplate.responsibilities.map(resp => `<li style="margin-bottom: 4px;">${resp}</li>`).join('')}
</ul>
</div>

<div style="margin-bottom: 20px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">Required Qualifications</h3>
<ul style="margin: 0; padding-left: 20px; color: #2d3748;">
${randomTemplate.requirements.map(req => `<li style="margin-bottom: 4px;">${req}</li>`).join('')}
</ul>
</div>

<div style="margin-bottom: 20px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">Preferred Qualifications</h3>
<ul style="margin: 0; padding-left: 20px; color: #2d3748;">
${randomTemplate.preferred.map(pref => `<li style="margin-bottom: 4px;">${pref}</li>`).join('')}
</ul>
</div>

<div style="margin-bottom: 20px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">What We Offer</h3>
<ul style="margin: 0; padding-left: 20px; color: #2d3748;">
${randomBenefits.map(benefit => `<li style="margin-bottom: 4px;">${benefit}</li>`).join('')}
</ul>
</div>

<div style="margin-bottom: 16px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #4a5568;">Job Details</h3>
<p style="margin: 0; color: #2d3748; line-height: 1.4;">
<strong>Location:</strong> ${randomLocation}<br>
<strong>Employment Type:</strong> ${randomJobType.charAt(0).toUpperCase() + randomJobType.slice(1)}<br>
<strong>Work Arrangement:</strong> ${randomWorkModel}
</p>
</div>

<div style="padding: 16px; background-color: #f7fafc; border-radius: 6px; border-left: 4px solid #3182ce;">
<p style="margin: 0; color: #2d3748; font-style: italic;">
${randomCompany} is an equal opportunity employer committed to diversity and inclusion. We welcome applications from all qualified candidates regardless of race, gender, age, religion, sexual orientation, or disability status.
</p>
</div>
</div>`;
        
        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            title: randomTemplate.title,
            company: randomCompany,
            location: randomLocation,
            type: randomJobType,
            work_model: randomWorkModel.toLowerCase(),
            description: realisticDescription,
            requirements: randomTemplate.requirements,
            benefits: randomBenefits
          })
          .eq('id', job.id);
        
        if (updateError) {
          console.log(`❌ Failed to update job ${i + 1}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Created: ${randomTemplate.title} at ${randomCompany} (${randomLocation})`);
          successCount++;
        }
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (jobError) {
        console.log(`❌ Error processing job ${i + 1}:`, jobError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 REALISTIC JOB RECREATION SUMMARY:');
    console.log(`✅ Successfully created: ${successCount} realistic job postings`);
    console.log(`❌ Failed creations: ${errorCount} jobs`);
    console.log(`📁 Total jobs processed: ${jobs.length}`);
    
    console.log('\n💼 INDEED-STYLE FEATURES ADDED:');
    console.log('✅ Professional job descriptions with clear structure');
    console.log('✅ Detailed responsibilities and requirements');
    console.log('✅ Realistic company names and locations');
    console.log('✅ Comprehensive benefits packages');
    console.log('✅ Equal opportunity employer statements');
    console.log('✅ Professional formatting and styling');
    
    console.log('\n🎯 JOB CATEGORIES INCLUDED:');
    console.log('• Full Stack Developer • Data Scientist • UX/UI Designer');
    console.log('• DevOps Engineer • Product Manager • Mobile Developer');
    console.log('• Software Engineer • Frontend Developer • Backend Developer');
    console.log('• QA Engineer');
    
    console.log('\n🎉 REALISTIC JOB POSTINGS COMPLETE!');
    console.log('🔄 Refresh your browser to see professional Indeed-style job listings!');
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

createRealisticJobs(); 
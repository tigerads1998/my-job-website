import { Job } from '../supabase';

// Mock data for production fallback
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Marketing Intern',
    company: 'SmartGrid Analytics',
    location: 'Miami, FL',
    type: 'internship',
    work_model: 'hybrid',
    is_verified: true,
    salary_min: 900,
    salary_max: 1350,
    description: `<div class="job-description" style="line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 20px;">
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Great opportunity for students or recent grads to get real marketing experience.</p>
</div>

<div style="margin-bottom: 18px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">What you'll do:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Social media management</li>
<li style="margin-bottom: 4px;">Content creation</li>
<li style="margin-bottom: 4px;">Market research</li>
</ul>
</div>

<div style="margin-bottom: 18px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">Requirements:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Currently studying marketing/business</li>
<li style="margin-bottom: 4px;">Social media savvy</li>
<li style="margin-bottom: 4px;">Creative mindset</li>
</ul>
</div>

<div style="margin-bottom: 16px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">Benefits:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Health insurance</li>
<li style="margin-bottom: 4px;">Flexible hours</li>
<li style="margin-bottom: 4px;">Remote work</li>
</ul>
</div>

<div style="padding: 12px; background-color: #f8fafc; border-radius: 6px;">
<p style="margin: 0; color: #4a5568; font-size: 0.9rem;">📍 Miami, FL • 💼 Internship • 🏢 Hybrid</p>
</div>

</div>`,
    requirements: ['Currently studying marketing/business', 'Social media savvy', 'Creative mindset'],
    benefits: ['Health insurance', 'Flexible hours', 'Remote work'],
    created_at: '2025-03-22T10:30:00Z',
    updated_at: '2025-03-22T10:30:00Z',
    is_active: true,
    employer_id: 'mock-employer-1'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'KappaTech Solutions',
    location: 'Boston, MA',
    type: 'full-time',
    work_model: 'remote',
    is_verified: true,
    salary_min: 1200,
    salary_max: 1800,
    description: `<div class="job-description" style="line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">About the Role</h3>
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">We are seeking a talented Full Stack Developer to join our growing engineering team. You will work on both frontend and backend systems, collaborating closely with our product and design teams.</p>
</div>

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">Key Responsibilities</h3>
<ul style="margin: 0; padding-left: 18px; color: #4a5568; font-size: 0.95rem;">
<li style="margin-bottom: 6px; line-height: 1.5;">Develop and maintain web applications using React and Node.js</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Design and implement RESTful APIs and database schemas</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Collaborate with cross-functional teams on feature development</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Write clean, maintainable code with proper testing</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Participate in code reviews and technical discussions</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Debug and optimize application performance</li>
</ul>
</div>

</div>`,
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of full stack development experience',
      'Proficiency in JavaScript, React, and Node.js',
      'Experience with SQL and NoSQL databases',
      'Knowledge of version control (Git)',
      'Strong problem-solving skills'
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance',
      'Flexible PTO and paid holidays',
      'Professional development budget ($2,000/year)',
      'Remote work flexibility',
      '401(k) with company matching'
    ],
    created_at: '2025-04-15T14:20:00Z',
    updated_at: '2025-04-15T14:20:00Z',
    is_active: true,
    employer_id: 'mock-employer-2'
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'VelocityAI Labs',
    location: 'San Francisco, CA',
    type: 'full-time',
    work_model: 'on-site',
    is_verified: false,
    salary_min: 1050,
    salary_max: 1575,
    description: `<div class="job-description" style="line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 20px;">
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Looking for a frontend dev to join our small but mighty team!</p>
</div>

<div style="margin-bottom: 18px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">What you'll do:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Build responsive web apps with React</li>
<li style="margin-bottom: 4px;">Work directly with founders</li>
<li style="margin-bottom: 4px;">Ship features fast</li>
</ul>
</div>

</div>`,
    requirements: ['2+ years React experience', 'JavaScript/TypeScript skills', 'Portfolio required'],
    benefits: ['Competitive salary', 'Health benefits', 'PTO'],
    created_at: '2025-05-08T09:45:00Z',
    updated_at: '2025-05-08T09:45:00Z',
    is_active: true,
    employer_id: 'mock-employer-3'
  },
  {
    id: '4',
    title: 'Sales Rep',
    company: 'CodeWave Systems',
    location: 'Chicago, IL',
    type: 'full-time',
    work_model: 'hybrid',
    is_verified: true,
    salary_min: 975,
    salary_max: 1462,
    description: `<div class="job-description" style="line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 20px;">
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Join our sales team and help grow our customer base.</p>
</div>

<div style="margin-bottom: 18px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">What you'll do:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Cold calling and lead generation</li>
<li style="margin-bottom: 4px;">Demo our product to prospects</li>
<li style="margin-bottom: 4px;">Close deals</li>
</ul>
</div>

</div>`,
    requirements: ['1+ years sales experience', 'Excellent communication', 'Goal-oriented'],
    benefits: ['Medical coverage', 'Stock options', 'Free lunch'],
    created_at: '2025-05-20T16:10:00Z',
    updated_at: '2025-05-20T16:10:00Z',
    is_active: true,
    employer_id: 'mock-employer-4'
  },
  {
    id: '5',
    title: 'Senior Software Engineer',
    company: 'NeuralNet Dynamics',
    location: 'Seattle, WA',
    type: 'full-time',
    work_model: 'remote',
    is_verified: true,
    salary_min: 1500,
    salary_max: 2250,
    description: `<div class="job-description" style="line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px;">

<div style="margin-bottom: 32px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
<h2 style="margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 700;">Senior Software Engineer</h2>
<p style="margin: 0; font-size: 1rem; opacity: 0.9;">Join NeuralNet Dynamics and make a significant impact in our growing organization</p>
</div>

<div style="margin-bottom: 28px;">
<h3 style="margin: 0 0 16px 0; font-size: 1.3rem; color: #1a202c; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">About This Opportunity</h3>
<p style="margin: 0; color: #4a5568; font-size: 1rem; line-height: 1.7;">We are looking for an experienced Senior Software Engineer to join our engineering team and help build scalable, high-performance systems. In this role, you will lead technical initiatives, mentor junior developers, and contribute to architectural decisions that will shape the future of our platform.</p>
</div>

</div>`,
    requirements: [
      'Bachelor\'s or Master\'s degree in Computer Science, Software Engineering, or equivalent practical experience',
      '5+ years of professional software development experience with strong track record of delivering complex projects',
      'Expert-level proficiency in at least one major programming language (Java, Python, Go, C#, etc.)',
      'Deep understanding of software architecture patterns, design principles, and system design concepts'
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance with 100% premium coverage for employees',
      'Flexible unlimited PTO policy plus company-wide holidays and mental health days',
      'Substantial professional development budget ($3,000+ annually) for courses, conferences, and certifications',
      'Remote work flexibility with home office setup stipend and co-working space reimbursement'
    ],
    created_at: '2025-06-02T11:25:00Z',
    updated_at: '2025-06-02T11:25:00Z',
    is_active: true,
    employer_id: 'mock-employer-5'
  },
  {
    id: '6',
    title: 'Product Designer',
    company: 'LightSpeed Computing',
    location: 'Austin, TX',
    type: 'full-time',
    work_model: 'hybrid',
    is_verified: false,
    salary_min: 1125,
    salary_max: 1687,
    description: `<div class="job-description" style="line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">About the Role</h3>
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Join our design team to create intuitive and beautiful user experiences. You'll work on our core product, conducting user research and designing interfaces that delight our customers.</p>
</div>

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">Key Responsibilities</h3>
<ul style="margin: 0; padding-left: 18px; color: #4a5568; font-size: 0.95rem;">
<li style="margin-bottom: 6px; line-height: 1.5;">Design user interfaces for web and mobile applications</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Conduct user research and usability testing</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Create wireframes, prototypes, and high-fidelity designs</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Collaborate with engineering on implementation</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Maintain design systems and component libraries</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Present design concepts to stakeholders</li>
</ul>
</div>

</div>`,
    requirements: [
      'Bachelor\'s degree in Design or related field',
      '3+ years of product design experience',
      'Proficiency in Figma and design tools',
      'Strong portfolio showcasing UX/UI work',
      'Understanding of user-centered design principles',
      'Experience with design systems'
    ],
    benefits: [
      'Excellent health benefits with low premiums',
      'Unlimited vacation policy',
      'Stock options and equity participation',
      'Learning stipend for courses and conferences',
      'Gym membership reimbursement'
    ],
    created_at: '2025-06-18T13:40:00Z',
    updated_at: '2025-06-18T13:40:00Z',
    is_active: true,
    employer_id: 'mock-employer-6'
  },
  {
    id: 'Zk7LmXr2vY9TQW3Z5eH8',
    title: 'Digital Marketing Specialist',
    company: 'SparkNova Media',
    location: 'Seattle, United States',
    type: 'full-time',
    work_model: 'hybrid',
    is_verified: true,
    salary_min: 4000,
    salary_max: 6000,
    description: `<div class="job-description" style="line-height: 1.6; font-family: 'Arial', sans-serif;">
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 1.3rem; color: #2d3748; font-weight: bold;">About SparkNova Media</h3>
        <p style="margin: 0; color: #4a5568; font-size: 0.9rem;">SparkNova Media is a freshly launched startup in Seattle, founded by a team of digital innovators passionate about transforming online marketing for small-to-medium enterprises in tech, wellness, and education. We're building a dynamic team to create bold, data-driven campaigns. Join us in our hybrid workspace to shape the future of digital engagement.</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 1.3rem; color: #2d3748; font-weight: bold;">Your Role</h3>
        <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 0.9rem;">As a Digital Marketing Specialist, you'll craft and execute campaigns that resonate with diverse audiences. You'll manage paid ads, optimize social media strategies, and analyze performance to drive client success. This hybrid role blends in-office collaboration with remote flexibility, allowing you to innovate while working closely with our creative and analytics teams.</p>
        <ul style="margin: 0; padding-left: 15px; color: #4a5568; font-size: 0.9rem;">
          <li style="margin-bottom: 6px;">Develop and launch digital campaigns across Google Ads, Meta, and LinkedIn</li>
          <li style="margin-bottom: 6px;">Track performance using Google Analytics and SEMrush to optimize results</li>
          <li style="margin-bottom: 6px;">Collaborate with content creators to produce engaging ad copy and visuals</li>
          <li style="margin-bottom: 6px;">Conduct A/B testing to refine campaign strategies</li>
          <li style="margin-bottom: 6px;">Manage social media calendars for consistent posting</li>
          <li style="margin-bottom: 6px;">Prepare client reports with performance insights</li>
        </ul>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 1.3rem; color: #2d3748; font-weight: bold;">Who You Are</h3>
        <p style="margin: 0 0 8px 0; color: #4a5568; font-size: 0.9rem;">We're seeking a creative and analytical individual with a knack for digital marketing. You thrive in a hybrid environment, balancing remote work with in-office collaboration. Your ability to adapt and innovate will help our startup grow.</p>
        <ul style="margin: 0; padding-left: 15px; color: #4a5568; font-size: 0.9rem;">
          <li style="margin-bottom: 6px;">2–3 years of experience in digital marketing or related roles</li>
          <li style="margin-bottom: 6px;">Proficiency in Google Ads, Meta Ads, Google Analytics, and SEMrush</li>
          <li style="margin-bottom: 6px;">Strong analytical skills to interpret campaign data</li>
          <li style="margin-bottom: 6px;">Experience with A/B testing and optimization techniques</li>
          <li style="margin-bottom: 6px;">Excellent written and verbal communication skills</li>
          <li style="margin-bottom: 6px;">Ability to manage multiple campaigns simultaneously</li>
          <li style="margin-bottom: 6px;">Familiarity with social media platforms and trends</li>
          <li style="margin-bottom: 6px;">Basic knowledge of SEO and content marketing</li>
          <li style="margin-bottom: 6px;">Comfortable working in a hybrid setup with reliable internet</li>
          <li style="margin-bottom: 6px;">Bachelor's degree in marketing, communications, or a related field</li>
          <li style="margin-bottom: 6px;">Passion for innovative marketing solutions</li>
          <li style="margin-bottom: 6px;">Ability to collaborate with cross-functional teams</li>
        </ul>
      </div>
    </div>`,
    requirements: [
      '2–3 years of experience in digital marketing',
      'Proficiency in Google Ads, Meta Ads, Google Analytics, SEMrush',
      'Strong analytical skills',
      'Experience with A/B testing',
      'Excellent communication skills',
      'Ability to manage multiple campaigns',
      'Familiarity with social media platforms',
      'Basic SEO knowledge',
      'Ability to work hybrid',
      'Bachelor\'s degree in marketing or related field',
      'Passion for innovative marketing',
      'Team collaboration skills'
    ],
    benefits: [
      'Hybrid work model with a modern Seattle office',
      '$500 annual learning fund for marketing skills',
      'Flexible full-time hours',
      'Monthly team creative workshops',
      'Work with innovative startups',
      'Home office setup stipend',
      'Software subscription discounts',
      'Regular performance feedback'
    ],
    created_at: '2025-06-21T09:00:00Z',
    updated_at: '2025-06-21T09:00:00Z',
    is_active: true,
    employer_id: 'mock-employer-sparknova'
  },
  {
    id: 'UNIQUE-JOB-ID-12345',
    title: 'Senior Backend Engineer',
    company: 'Innovatech Solutions Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    work_model: 'remote',
    is_verified: true,
    salary_min: 120000,
    salary_max: 160000,
    description: "<h3>Job Summary</h3><p>We are seeking an experienced Senior Backend Engineer to join our innovative team. You will be responsible for designing, developing, and maintaining the server-side of our cutting-edge applications, ensuring high performance and responsiveness to requests from the front-end.</p><br><h3>Key Responsibilities</h3><ul><li>Design and build scalable RESTful APIs for our web and mobile applications.</li><li>Optimize applications for maximum speed, scalability, and security.</li><li>Collaborate with front-end developers and product managers to deliver high-quality features.</li><li>Write clean, maintainable, and well-documented code.</li><li>Mentor junior engineers and contribute to a culture of technical excellence.</li></ul><br><h3>Qualifications</h3><ul><li>5+ years of professional experience in backend development.</li><li>Strong proficiency in a major backend language (e.g., Node.js, Python, Go, or Java).</li><li>Extensive experience with database technologies like PostgreSQL, MongoDB, or Redis.</li><li>Experience with cloud platforms (AWS, Google Cloud, or Azure).</li><li>Solid understanding of data structures, algorithms, and system design.</li></ul>",
    requirements: [
      "5+ years of backend development experience",
      "Proficiency in Node.js or Python",
      "Experience with cloud services (AWS preferred)",
      "Strong knowledge of SQL and NoSQL databases",
      "Excellent problem-solving and communication skills",
      "Bachelor's degree in Computer Science or a related field"
    ],
    benefits: [
      "Competitive salary and stock options",
      "Comprehensive health, dental, and vision insurance",
      "Unlimited Paid Time Off (PTO)",
      "Flexible remote work policy",
      "Annual budget for professional development",
      "Home office setup stipend"
    ],
    created_at: '2025-06-22T10:00:00Z',
    updated_at: '2025-06-22T10:00:00Z',
    is_active: true,
    employer_id: 'mock-employer-innovatech'
  }
];

export const mockJobService = {
  async createJob(jobData: any): Promise<Job> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful job creation
    const mockJob: Job = {
      id: `mock-job-${Date.now()}`,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type,
      work_model: jobData.work_model || 'on-site',
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      description: jobData.description,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      is_verified: jobData.is_verified || false,
      is_active: true,
      employer_id: 'mock-employer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('✅ Mock job created successfully:', mockJob.id)
    return mockJob
  },

  async getJobs(filters?: any): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredJobs = [...mockJobs];
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters?.type) {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }
    
    if (filters?.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters?.work_model) {
      filteredJobs = filteredJobs.filter(job => job.work_model === filters.work_model);
    }
    
    return filteredJobs;
  },

  async getJobById(id: string): Promise<Job | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const job = mockJobs.find(job => job.id === id);
    return job || null;
  },

  async searchJobs(searchTerm: string): Promise<Job[]> {
    return this.getJobs({ search: searchTerm });
  }
}; 
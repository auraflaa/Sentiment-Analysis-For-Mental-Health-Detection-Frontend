import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  LandingPage,
  SurveyPage,
  ResultsPage,
  ResourcesPage,
  ResearchPage,
  PastAssessmentsPage,
  PrivacyPolicy,
  TermsOfService,
  Disclaimer
} from './components';
import CursorGlow from './components/CursorGlow';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <CursorGlow />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/past-assessments" element={<PastAssessmentsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
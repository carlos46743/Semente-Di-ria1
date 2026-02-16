import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import StudyView from './views/StudyView';
import PlansView from './views/PlansView';
import QuizView from './views/QuizView';
import CommunityView from './views/CommunityView';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/study" element={<StudyView />} />
          <Route path="/plans" element={<PlansView />} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/community" element={<CommunityView />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
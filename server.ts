import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import {
  getMembersFromDb,
  saveMemberToDb,
  deleteMemberFromDb,
  getAuditLogsFromDb,
  saveAuditLogToDb,
} from './src/db/members.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // User Sync Route (Firebase Auth -> Cloud SQL)
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@desbravadores.app`;
      const { displayName, photoURL } = req.body;
      const dbUser = await getOrCreateUser(uid, email, displayName, photoURL);
      res.json({ success: true, user: dbUser });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Members API Routes
  app.get('/api/members', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const members = await getMembersFromDb();
      res.json(members);
    } catch (error: any) {
      console.error('Failed to get members:', error);
      res.status(500).json({ error: error.message || 'Failed to get members' });
    }
  });

  app.post('/api/members', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const memberData = req.body;
      const userId = req.user?.uid;
      const saved = await saveMemberToDb(memberData, userId);
      res.json(saved);
    } catch (error: any) {
      console.error('Failed to save member:', error);
      res.status(500).json({ error: error.message || 'Failed to save member' });
    }
  });

  app.put('/api/members/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const memberData = req.body;
      const userId = req.user?.uid;
      const saved = await saveMemberToDb(memberData, userId);
      res.json(saved);
    } catch (error: any) {
      console.error('Failed to update member:', error);
      res.status(500).json({ error: error.message || 'Failed to update member' });
    }
  });

  app.delete('/api/members/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await deleteMemberFromDb(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to delete member:', error);
      res.status(500).json({ error: error.message || 'Failed to delete member' });
    }
  });

  // Audit Logs API Routes
  app.get('/api/audit', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const logs = await getAuditLogsFromDb();
      res.json(logs);
    } catch (error: any) {
      console.error('Failed to get audit logs:', error);
      res.status(500).json({ error: error.message || 'Failed to get audit logs' });
    }
  });

  app.post('/api/audit', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const logData = req.body;
      const userId = req.user?.uid;
      const saved = await saveAuditLogToDb(logData, userId);
      res.json(saved);
    } catch (error: any) {
      console.error('Failed to save audit log:', error);
      res.status(500).json({ error: error.message || 'Failed to save audit log' });
    }
  });

  // Vite middleware for development / Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

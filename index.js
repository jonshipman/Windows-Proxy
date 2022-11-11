import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { exec } from 'node:child_process';

const app = express();
const MAC = process.env.HYPERV_MAC || '00-15-*';

const PORT = process.argv[2];
const COMMAND = `@echo off & for /f "tokens=1" %g IN ('arp -a ^| findstr ${MAC}') do (echo %g)`;

exec(COMMAND, {}, function (_error, HOST) {
	app.use(
		'*',
		createProxyMiddleware({
			logLevel: 'silent',
			target: `http://${HOST.trim()}:${PORT}`,
		})
	);

	app.listen(PORT, () => {
		console.log(`Starting Proxy at http://localhost:${PORT} for ${HOST}`);
	});
});

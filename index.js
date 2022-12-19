import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { exec } from 'node:child_process';

const app = express();
const MAC = process.env.HYPERV_MAC || '00-15-*';

const options = [];
const flags = [];

for (const arg of process.argv) {
	if (0 !== arg.indexOf('-')) {
		options.push(arg);
	} else {
		flags.push(arg);
	}
}

const PORT = options[2];
const COMMAND = `@echo off & for /f "tokens=1" %g IN ('arp -a ^| findstr ${MAC}') do (echo %g)`;

function Server(h) {
	app.use(
		'*',
		createProxyMiddleware({
			logLevel: 'silent',
			target: `http://${h.trim()}:${PORT}`,
		})
	);

	app.listen(PORT, () => {
		console.log(`Starting Proxy at http://localhost:${PORT} for ${h}`);
	});
}

if (flags.includes('--latitude')) {
	Server('latitude');
} else {
	exec(COMMAND, {}, function (_error, HOST) {
		Server(HOST);
	});
}

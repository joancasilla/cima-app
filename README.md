# CIMA APP — SEMS Ingeniería

**Construcción Industrializada y Montaje Ágil**

Aplicación web para gestión de preempacado de materiales de construcción y generación de etiquetas térmicas 4×6".

## Stack

- **Frontend:** HTML5 + Tailwind CSS + SheetJS (hospedado en GitHub Pages)
- **Backend:** Google Apps Script como API (escribe en Google Sheets)
- **Dominio:** cima.sems.com.do

## Configuración

### 1. GitHub Pages
- Settings → Pages → Branch: `main` / `root`
- Custom domain: `cima.sems.com.do`

### 2. DNS (Route 53)
- Record: `cima` → CNAME → `TU-USUARIO.github.io`

### 3. Google Apps Script
- Pegar `Code.gs` en el proyecto de Apps Script
- Deploy → Web App → Anyone
- Copiar la URL y pegarla en `index.html` (variable `API_APPS_SCRIPT`)

## Estructura
```
index.html   → Aplicación completa (frontend)
CNAME        → Dominio personalizado para GitHub Pages
Code.gs      → Backend (se pega en Google Apps Script, NO en este repo)
```

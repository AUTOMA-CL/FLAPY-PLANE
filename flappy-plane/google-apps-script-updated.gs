// ACTUALIZACIÓN DEL GOOGLE APPS SCRIPT - Agregar esta función al código existente

const SPREADSHEET_ID = "1H_sCVuLainvEFvZV0WtQ-MzZnDfuQkYeiRI9llW5Y7Q";
const SHEET_NAME = "Respuestas";

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const action = e.parameter.action;
    
    // NUEVA ACCIÓN PARA ANALYTICS
    if (action === 'getAnalytics') {
      const data = sheet.getDataRange().getValues();
      
      // Saltar la primera fila (cabeceras)
      const users = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i][2]) { // Si hay email
          users.push({
            nombre: data[i][0] || '',
            telefono: data[i][1] || '',
            email: data[i][2] || '',
            edad: data[i][3] || '',
            puntaje: data[i][4] || 0
          });
        }
      }
      
      return jsonResponse({
        ok: true,
        users: users,
        totalRegistros: users.length
      });
    }
    
    if (action === 'register') {
      const nombre = e.parameter.nombre;
      const telefono = e.parameter.telefono;
      const email = e.parameter.email;
      const edad = e.parameter.edad;
      
      if (!nombre || !telefono || !email || !edad) {
        return jsonResponse({ok: false, error: 'Faltan campos'});
      }
      
      const data = sheet.getDataRange().getValues();
      let existingRow = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email) {
          existingRow = i + 1;
          break;
        }
      }
      
      if (existingRow > 0) {
        sheet.getRange(existingRow, 1).setValue(nombre);
        sheet.getRange(existingRow, 2).setValue(telefono);
        sheet.getRange(existingRow, 4).setValue(edad);
        return jsonResponse({ok: true, existing: true, row: existingRow});
      } else {
        sheet.appendRow([nombre, telefono, email, edad, ""]);
        return jsonResponse({ok: true, existing: false, row: sheet.getLastRow()});
      }
      
    } else if (action === 'updateScore') {
      const email = e.parameter.email;
      const puntaje = e.parameter.puntaje;
      
      if (!email || !puntaje) {
        return jsonResponse({ok: false, error: 'Faltan campos'});
      }
      
      const data = sheet.getDataRange().getValues();
      let targetRow = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email) {
          targetRow = i + 1;
          break;
        }
      }
      
      if (targetRow < 0) {
        return jsonResponse({ok: false, error: 'Email no encontrado'});
      }
      
      const numericScore = Number(puntaje);
      sheet.getRange(targetRow, 5).setValue(numericScore);
      return jsonResponse({ok: true, row: targetRow, puntaje: numericScore});
    }
    
    return jsonResponse({ok: false, error: 'Acción no válida'});
    
  } catch (error) {
    return jsonResponse({ok: false, error: error.toString()});
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
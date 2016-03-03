var clientCtr = require('../controllers/client');
var router = require('express').Router();

module.exports = router;

router.get('/', clientCtr.listClients);
router.get('/add', clientCtr.addClientPage);
router.get('/view/:clientName', clientCtr.viewClientPage());

router.post('/', clientCtr.addClient);
router.post('/update/:clientName', clientCtr.updateClient);
router.get('/delete/:clientName', clientCtr.deleteClient);

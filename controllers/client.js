var Client = require('../models/Client');

var api = module.exports;

api.addClientPage = function (req, res, next) {
  res.render('client/add', {
    title: '添加客户端',
    ssoInfo: (req.flash('sso-info'))[0],
    error: (req.flash('error'))[0],
    success: (req.flash('success'))[0]
  });
}

api.viewClientPage = function (ops) {
  return function (req, res, next) {
    var client = Client.findOne({name: req.params.clientName}, function (err, client) {
      if (err) throw err;

      console.log(client);

      res.render('client/view', {
        title: client.name + ' --- 客户端',
        ssoInfo: (req.flash('sso-info'))[0],
        error: (req.flash('error'))[0],
        success: (req.flash('success'))[0],
        client: client
      });
    });
  }
}

api.addClient = function (req, res, next) {

  var client = {
    name: req.body.clientName,
    domain: req.body.clientDomain,
    isCrossDomain: (req.body.isCrossDomain === 'true'),
    description: req.body.clientDescription,
    accessToken: req.body.accessToken
  };

  var newClient = new Client(client);

  newClient.save(function (err, added) {
    if (err) throw err;
    res.redirect('/clients');
  });
}

api.deleteClient = function (req, res, next) {
  var clientName = req.params.clientName;
  Client.findOneAndRemove({name: clientName}, function (err, removed) {
    if (err) throw err;
    res.redirect('back');
  });
}

api.updateClient = function (req, res, next) {
  var _id = req.body._id;
  var client = {
    name: req.body.clientName,
    domain: req.body.clientDomain,
    isCrossDomain: (req.body.isCrossDomain === 'true'),
    description: req.body.clientDescription,
    accessToken: req.body.accessToken
  };

  Client.findOneAndUpdate({_id: _id}, client, function (err) {
    if (err) throw err;

    res.redirect('/clients/view/' + client.name);
  });
}

api.listClients = function (req, res, next) {
  Client.find({name: new RegExp(req.body.clientName)}, function (err, clients) {
    if (err) throw err;
    console.log(clients);
    res.render('client/list', {
      title: '客户端列表',
      ssoInfo: (req.flash('sso-info'))[0],
      error: (req.flash('error'))[0],
      success: (req.flash('success'))[0],
      clients: clients
    });
  })
}
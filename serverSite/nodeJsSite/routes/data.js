
/*
 * GET JSONP data.
 */

exports.index = function(req, res){
  res.render('data', { callbackFunction: req.query.callback });
};

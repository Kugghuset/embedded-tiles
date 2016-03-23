'use strict'

export const get = (req, res) => res.render('main', {
  layout: false,
  data: {
    token: req.device.token
  }
});

export default {
  get: get
}

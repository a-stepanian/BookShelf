const Club = require('../models/clubModel');

module.exports.index = async (req, res) => {
    const clubs = await Club.find().populate('clubBooks');
    res.render('clubs/index', { clubs });
}

module.exports.renderNewForm = (req, res) => {
    res.render('clubs/new');
}

module.exports.new = async (req, res) => {
    const { clubName } = req.body;
    const author = req.user._id;
    const clubImgUrl = '';
    const clubMembers = [];
    const clubBooks = [];
    const club = await new Club({ clubName, clubMembers, clubBooks, author, clubImgUrl });
    await club.save();
    res.redirect('/clubs');
}

module.exports.show = async (req, res) => {
    const club = await Club.findById(req.params.id).populate('author').populate('clubBooks')
        .populate({
            path: 'clubMembers',
            populate: {
                path: '_id'
            }
        });
    res.render('clubs/show', { club });
}

module.exports.renderEditForm = async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/edit', { club });
}

module.exports.joinClub = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const club = await Club.findById(id); 
    club.clubMembers.push(user);
    club.save();
    res.redirect(`/clubs/${id}`);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    await Club.findByIdAndUpdate(id, req.body);
    res.redirect(`/clubs/${req.params.id}`);
}

module.exports.delete = async (req, res) => {
    await Club.findByIdAndDelete(req.params.id);
    res.redirect('/clubs')
}
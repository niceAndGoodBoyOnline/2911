const Event = require('../models/Event');

class EventRepo {
    EventRepo() {        
    }

    async GetEvents() {
        let events = await Event.find().exec();
        return events;
    }

    async create(newEvent) {
        var error = await newEvent.validateSync();
        const result = await newEvent.save();

        let response = {
            obj:          result,
            errorMessage: "" };

        return response;
    } 

    async update(newAttendee) {
        let eventObject = await Event.findOne({eventName:newAttendee.eventName}).exec();
        if(eventObject){
            let attendeearray = eventObject.eventAttendees
            for(let i=0;i<attendeearray.length;i++){
                if (attendeearray[i] == newAttendee.eventAttendees[0]){
                    return "User Already Attending"
                } 
            }
            attendeearray.push(newAttendee.eventAttendees[0])
            let updated = await Event.updateOne(
                { eventName:newAttendee.eventName},
                {$set: {eventAttendees:attendeearray} }
            )
        }
        return "You are now attending " + eventObject.eventName
    }

    async getOneEvent(eventNameObj){
        let eventObject = await Event.findOne({eventName:eventNameObj.eventName}).exec();
        return eventObject

    }

    async deleteEvent(eventNameObj){
        let eventObject = await Event.findOne({eventName:eventNameObj.eventName}).remove().exec();
        return eventObject

    }

    async getAttendingEvents(attendee){
        let eventArray = []
        let events = await Event.find().exec();
        for(let i=0;i<events.length;i++){
            for(let j=0;j<events[i].eventAttendees.length;j++){
                    if(attendee == events[i].eventAttendees[j]){
                        eventArray.push(events[i])
                    }
            }
        }

        return eventArray
    }

    async removeAttendee(attendee){
        let eventObject = await Event.findOne({eventName:attendee.eventName}).exec();
        let attendees = eventObject.eventAttendees

        let index = attendees.indexOf(attendee.eventAttendees)
        attendees.splice(index, 1)
        
        let updated = await Event.updateOne(
            { eventName:attendee.eventName},
            {$set: {eventAttendees:attendees} }
        )

        return updated
    }
}

module.exports = EventRepo;


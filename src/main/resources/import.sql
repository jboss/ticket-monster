insert into MediaItem (id, mediaType, url) values (100, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-Weir%2C_Bob_(2007)_2.jpg')
insert into MediaItem (id, mediaType, url) values (101, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-Carnival_Puppets.jpg')
insert into MediaItem (id, mediaType, url) values (102, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-Opera_House_with_Sydney.jpg')
insert into MediaItem (id, mediaType, url) values (103, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-Roy_Thomson_Hall_Toronto.jpg')
insert into MediaItem (id, mediaType, url) values (104, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-West-stand-bmo-field.jpg')
insert into MediaItem (id, mediaType, url) values (105, 'IMAGE', 'http://dl.dropbox.com/u/65660684/640px-Brazil_national_football_team_training_at_Dobsonville_Stadium_2010-06-03_13.jpg')

insert into Venue (id, name, city, country, street, description, picture_id, capacity) values (1, 'Roy Thomson Hall', 'Toronto', 'Canada', '60 Simcoe Street','Roy Thomson Hall is the home of the Toronto Symphony Orchestra and the Toronto Mendelssohn Choir.',103, 2630);

insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (1, 'A', 'Premier platinum reserve',40, 100, 1);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (2, 'B', 'Premier gold reserve', 40, 100, 1);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (3, 'C', 'Premier silver reserve', 30, 200, 1);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (4, 'D', 'General', 80, 200, 1);

insert into Venue (id, name, city, country, street, description, picture_id, capacity) values (2, 'Sydney Opera House', 'Sydney', 'Australia', 'Bennelong point', 'The Sydney Opera House is a multi-venue performing arts centre in Sydney, New South Wales, Australia' , 102, 18000);

insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (100, 'S1', 'Front left', 50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (101, 'S2', 'Front centre', 50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (102, 'S3', 'Front right',50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (103, 'S4', 'Rear left', 50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (104, 'S5', 'Rear centre', 50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (105, 'S6', 'Rear right', 50, 50, 2);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (106, 'S7', 'Balcony', 1, 30, 2);

insert into Venue (id, name, city, country, street, description, picture_id, capacity) values (3, 'BMO Field', 'Toronto', 'Canada', '170 Princes Boulevard','BMO Field is a Canadian soccer stadium located in Exhibition Place in the city of Toronto.',104, 21140);

insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (5, 'A', 'Premier platinum reserve',40, 100, 3);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (6, 'B', 'Premier gold reserve', 40, 100, 3);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (7, 'C', 'Premier silver reserve', 30, 200, 3);
insert into Section (id, name, description, numberofrows, rowcapacity, venue_id) values (8, 'D', 'General', 80, 200, 3);


insert into eventcategory (id, description) values (1, 'Concert');
insert into eventcategory (id, description) values (2, 'Theatre');
insert into eventcategory (id, description) values (3, 'Musical');
insert into eventcategory (id, description) values (4, 'Sporting');
insert into eventcategory (id, description) values (5, 'Comedy');

insert into event (id, name, description, picture_id, category_id, major) values (1, 'Rock concert of the decade', 'Get ready to rock your night away with this megaconcert extravaganza from 10 of the biggest rock stars of the 80''s', 100, 1, true);
insert into event (id, name, description, picture_id, category_id, major) values (2, 'Shane''s Sock Puppets', 'This critically acclaimed masterpiece will take you on an emotional rollercoaster the likes of which you''ve never experienced.', 101, 2, true);
insert into event (id, name, description, picture_id, category_id, major) values (3, 'Brazil vs. Italy', 'A friendly replay of the famous World Cup final.', 105, 4, false);

insert into show (id, event_id, venue_id) values (1, 1, 1);
insert into performance (id, show_id, date) values (1, 1, '2013-04-01 19:00:00');
insert into performance (id, show_id, date) values (2, 1, '2013-04-02 19:00:00');

insert into show (id, event_id, venue_id) values (2, 1, 2);
insert into performance (id, show_id, date) values (3, 2, '2013-04-03 19:30:00');
insert into performance (id, show_id, date) values (4, 2, '2013-04-04 19:30:00');

insert into show (id, event_id, venue_id) values (3, 2, 1);
insert into performance (id, show_id, date) values (5, 3, '2013-04-05 17:00:00');
insert into performance (id, show_id, date) values (6, 3, '2013-04-05 19:30:00');

insert into show (id, event_id, venue_id) values (4, 2, 2);
insert into performance (id, show_id, date) values (7, 4, '2013-04-07 17:00:00');
insert into performance (id, show_id, date) values (8, 4, '2013-04-07 19:30:00');

insert into show (id, event_id, venue_id) values (5, 3, 3);
insert into performance (id, show_id, date) values (9, 5, '2013-05-11 21:00:00');


insert into TicketCategory (id, description) values (1, 'Adult');
insert into TicketCategory (id, description) values (2, 'Child 0-14yrs');

insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (1, 2, 100, 1, 167.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (2, 2, 101, 1, 197.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (3, 2, 102, 1, 167.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (4, 2, 103, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (5, 2, 104, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (6, 2, 105, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (7, 2, 106, 1, 122.5);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (8, 2, 100, 2, 157.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (9, 2, 101, 2, 187.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (10, 2, 102, 2, 157.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (11, 2, 103, 2, 145.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (12, 2, 104, 2, 145.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (13, 2, 105, 2, 145.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (14, 2, 106, 2, 112.5);

insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (15, 1, 1, 1, 219.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (16, 1, 2, 1, 199.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (17, 1, 3, 1, 179.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (18, 1, 4, 1, 149.50);


insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (19, 4, 100, 1, 167.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (20, 4, 101, 1, 197.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (21, 4, 102, 1, 167.75);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (22, 4, 103, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (23, 4, 104, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (24, 4, 105, 1, 155.0);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (25, 4, 106, 1, 122.5);

insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (26, 3, 1, 1, 219.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (27, 3, 2, 1, 199.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (28, 3, 3, 1, 179.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (29, 3, 4, 1, 149.50);

insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (30, 5, 5, 1, 219.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (31, 5, 6, 1, 199.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (32, 5, 7, 1, 179.50);
insert into TicketPriceCategory (id, show_id, section_id, ticketcategory_id, price) values (33, 5, 8, 1, 149.50);

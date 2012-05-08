package org.jboss.jdf.example.ticketmonster.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ejb.Singleton;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.jdf.example.ticketmonster.monitor.client.shared.qualifier.Cancelled;
import org.jboss.jdf.example.ticketmonster.monitor.client.shared.qualifier.Created;
import org.jboss.jdf.example.ticketmonster.model.Booking;
import org.jboss.jdf.example.ticketmonster.model.Performance;
import org.jboss.jdf.example.ticketmonster.model.Seat;
import org.jboss.jdf.example.ticketmonster.model.Section;
import org.jboss.jdf.example.ticketmonster.model.Ticket;
import org.jboss.jdf.example.ticketmonster.model.TicketCategory;
import org.jboss.jdf.example.ticketmonster.model.TicketPrice;
import org.jboss.jdf.example.ticketmonster.service.SeatAllocationService;

/**
 * <p>
 *     A JAX-RS endpoint for handling {@link Booking}s. Inherits the GET
 *     methods from {@link BaseEntityService}, and implements additional REST methods.
 * </p>
 *
 * @author Marius Bogoevici
 * @author Pete Muir
 */
@Path("/bookings")
/**
 * <p>
 *     This is a stateless service, so a single shared instance can be used in this case.
 * </p>
 */
@Singleton
public class BookingService extends BaseEntityService<Booking> {

    @Inject
    SeatAllocationService seatAllocationService;

    @Inject @Created
    private Event<Booking> newBookingEvent;
    
    @Inject @Cancelled
    private Event<Booking> cancelledBookingEvent;
    
    public BookingService() {
        super(Booking.class);
    }

    /**
<    * <p>
     * Delete a booking by id
     * </p>
     * @param id
     * @return
=    */
    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteBooking(@PathParam("id") Long id) {
        Booking booking = getEntityManager().find(Booking.class, id);
        if (booking == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        getEntityManager().remove(booking);
        cancelledBookingEvent.fire(booking);
        return Response.ok().build();
    }

    /**
     * <p>
     *   Create a booking. Data is contained in the bookingRequest object
     * </p>
     * @param bookingRequest
     * @return
     */
    @SuppressWarnings("unchecked")
    @POST
    /**
     * <p> Data is received in JSON format. For easy handling, it will be unmarshalled in the support
     * {@link BookingRequest} class.
     */
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createBooking(BookingRequest bookingRequest) {
        try {
            // First, validate the posted data
            // There will be more validation when persistence occurs

        	Set<Long> TicketPrices = new HashSet<Long>();
            for (TicketRequest ticketRequest : bookingRequest.getTicketRequests()) {
                if (TicketPrices.contains(ticketRequest.getTicketPrice())) {
                    throw new RuntimeException("Duplicate price category id");
                }
                TicketPrices.add(ticketRequest.getTicketPrice());
            }

            // First, load the entities that make up this booking's relationships
            Performance performance = getEntityManager().find(Performance.class, bookingRequest.getPerformance());

            // As we can have a mix of ticket types in a booking, we need to load all of them that are relevant, 
            // id
            List<TicketPrice> ticketPrices = (List<TicketPrice>) getEntityManager()
                    .createQuery("select p from TicketPrice p where p.id in :ids")
                    .setParameter("ids", TicketPrices).getResultList();
            // Now, map them by id
            Map<Long, TicketPrice> ticketPricesById = new HashMap<Long, TicketPrice>();
            for (TicketPrice ticketPrice : ticketPrices) {
                ticketPricesById.put(ticketPrice.getId(), ticketPrice);
            }

            // Now, start to create the booking from the posted data
            // Set the simple stuff first!
            Booking booking = new Booking();
            booking.setContactEmail(bookingRequest.getEmail());
            booking.setPerformance(performance);
            booking.setCancellationCode("abc");

            // Now, we iterate over each ticket that was requested, and organize them by section and category
            // we want to allocate ticket requests that belong to the same section contiguously
            Map<Section, Map<TicketCategory, TicketRequest>> ticketRequestsPerSection = new LinkedHashMap<Section, Map<TicketCategory, TicketRequest>>();
            for (TicketRequest ticketRequest : bookingRequest.getTicketRequests()) {
                final TicketPrice ticketPrice = ticketPricesById.get(ticketRequest.getTicketPrice());
                if (!ticketRequestsPerSection.containsKey(ticketPrice.getSection())) {
                    ticketRequestsPerSection
                            .put(ticketPrice.getSection(), new LinkedHashMap<TicketCategory, TicketRequest>());
                }
                ticketRequestsPerSection.get(ticketPrice.getSection()).put(
                        ticketPricesById.get(ticketRequest.getTicketPrice()).getTicketCategory(), ticketRequest);
            }

            // Now, we can allocate the tickets
            // Iterate over the sections
            for (Section section : ticketRequestsPerSection.keySet()) {
                int totalTicketsRequestedPerSection = 0;
                // Compute the total number of tickets required (a ticket category doesn't impact the actual seat!)
                final Map<TicketCategory, TicketRequest> ticketRequestsByCategories = ticketRequestsPerSection.get(section);
                // calculate the total quantity of tickets to be allocated in this section
                for (TicketRequest ticketRequest : ticketRequestsByCategories.values()) {
                    totalTicketsRequestedPerSection += ticketRequest.getQuantity();
                }
                // try to allocate seats - if this fails, an exception will be thrown
                List<Seat> seats = seatAllocationService.allocateSeats(section, performance, totalTicketsRequestedPerSection, true);
                // allocation was successful, begin generating tickets
                // associate each allocated seat with a ticket, assigning a price category to it
                int seatCounter = 0;
                // Now, add a ticket for each requested ticket to the booking
                for (TicketCategory ticketCategory : ticketRequestsByCategories.keySet()) {
                    final TicketRequest ticketRequest = ticketRequestsByCategories.get(ticketCategory);
                    final TicketPrice ticketPrice = ticketPricesById.get(ticketRequest.getTicketPrice());
                    for (int i = 0; i < ticketRequest.getQuantity(); i++) {
                        Ticket ticket = new Ticket(seats.get(seatCounter + i), ticketCategory, ticketPrice.getPrice());
                        // getEntityManager().persist(ticket);
                        booking.getTickets().add(ticket);
                    }
                    seatCounter += ticketRequest.getQuantity();
                }
            }
            // Persist the booking, including cascaded relationships
            booking.setPerformance(performance);
            booking.setCancellationCode("abc");
            getEntityManager().persist(booking);
            newBookingEvent.fire(booking);
            return Response.ok().entity(booking).type(MediaType.APPLICATION_JSON_TYPE).build();
        } catch (ConstraintViolationException e) {
            // If validation of the data failed using Bean Validation, then send an error
            Map<String, Object> errors = new HashMap<String, Object>();
            List<String> errorMessages = new ArrayList<String>();
            for (ConstraintViolation<?> constraintViolation : e.getConstraintViolations()) {
                errorMessages.add(constraintViolation.getMessage());
            }
            errors.put("errors", errorMessages);
            return Response.status(Response.Status.BAD_REQUEST).entity(errors).build();
        } catch (Exception e) {
            // Finally, handle unexpected exceptions
            Map<String, Object> errors = new HashMap<String, Object>();
            errors.put("errors", Collections.singletonList(e.getMessage()));
            return Response.status(Response.Status.BAD_REQUEST).entity(errors).build();
        }
    }

}

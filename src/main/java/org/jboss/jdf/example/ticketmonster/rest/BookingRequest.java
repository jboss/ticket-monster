package org.jboss.jdf.example.ticketmonster.rest;

import java.util.ArrayList;
import java.util.List;

import org.jboss.jdf.example.ticketmonster.model.Performance;

/**
 * <p>
 * A {@link BookingRequest} is populated with unmarshalled JSON data, and handed to @{link
 * {@link BookingService#createBooking(BookingRequest)}.
 * </p>
 * 
 * @author Marius Bogoevici
 * @author Pete Muir
 * 
 */
public class BookingRequest {

    private List<TicketRequest> ticketRequests = new ArrayList<TicketRequest>();
    private long performance;
    private String email;
    
    public BookingRequest() {
        // Empty constructor for JAXB
    }

    public BookingRequest(Performance performance, String email) {
        this.performance = performance.getId();
        this.email = email;
    }

    public List<TicketRequest> getTicketRequests() {
        return ticketRequests;
    }

    public void setTicketRequests(List<TicketRequest> ticketRequests) {
        this.ticketRequests = ticketRequests;
    }
    
    public BookingRequest addTicketRequest(TicketRequest ticketRequest) {
        ticketRequests.add(ticketRequest);
        return this;
    }

    public long getPerformance() {
        return performance;
    }

    public void setPerformance(long performance) {

        this.performance = performance;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

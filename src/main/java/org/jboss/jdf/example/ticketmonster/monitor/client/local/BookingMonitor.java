package org.jboss.jdf.example.ticketmonster.monitor.client.local;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.jboss.errai.bus.client.api.RemoteCallback;
import org.jboss.errai.ioc.client.api.AfterInitialization;
import org.jboss.errai.ioc.client.api.Caller;
import org.jboss.errai.ioc.client.api.EntryPoint;
import org.jboss.jdf.example.ticketmonster.monitor.client.shared.BookingMonitorService;
import org.jboss.jdf.example.ticketmonster.monitor.client.shared.qualifier.Cancelled;
import org.jboss.jdf.example.ticketmonster.monitor.client.shared.qualifier.Created;
import org.jboss.jdf.example.ticketmonster.model.Booking;
import org.jboss.jdf.example.ticketmonster.model.Performance;
import org.jboss.jdf.example.ticketmonster.model.Show;

import com.google.gwt.user.client.ui.RootPanel;

/**
 * The entry point into the TicketMonster booking monitor. 
 * 
 * The {@code @EntryPoint} annotation indicates to the Errai framework that 
 * this class should be instantiated inside the web browser when the web page
 * is first loaded.
 * 
 * @author Christian Sadilek <csadilek@redhat.com>
 */
@EntryPoint
public class BookingMonitor {
    /**
     * This map caches the number of sold tickets for each {@link Performance} using 
     * the performance id as key.
     */
    private static Map<Long, Long> occupiedCounts;
    
    /**
     * This is the client-side proxy to the {@link BookingMonitorService}. 
     * The proxy is generated at build time, and injected into this field when the page loads.
     */
    @Inject
    private Caller<BookingMonitorService> monitorService;

    /**
     * We store references to {@link ShowStatusWidget}s in this map, so we can update
     * these widgets when {@link Booking}s are received for the corresponding {@link Show}.
     */
    private Map<Show, ShowStatusWidget> shows = new HashMap<Show, ShowStatusWidget>();
    
    /**
     * This method constructs the UI.
     * 
     * Methods annotated with Errai's {@link AfterInitialization} are only called once 
     * everything is up and running, including the communication channel to the server.
     */
    @AfterInitialization
    public void createAndShowUI() {
        // Retrieve the number of sold tickets for each performance. 
        monitorService.call(new RemoteCallback<Map<Long, Long>>() {
            @Override
            public void callback(Map<Long, Long> occupiedCounts) {
                BookingMonitor.occupiedCounts = occupiedCounts;
                listShows();
            }
        }).retrieveOccupiedCounts();
    }

    private void listShows() {
        // Retrieve all shows
        monitorService.call(new RemoteCallback<List<Show>>() {
            @Override
            public void callback(List<Show> shows) {
                // Sort based on event name
                Collections.sort(shows, new Comparator<Show>() {
                    @Override
                    public int compare(Show s0, Show s1) {
                        return s0.getEvent().getName().compareTo(s1.getEvent().getName());
                    }
                });
                
                // Create a show status widget for each show
                for (Show show : shows) {
                    ShowStatusWidget sw = new ShowStatusWidget(show);
                    BookingMonitor.this.shows.put(show, sw);
                    RootPanel.get("content").add(sw);
                }
            }
        }).retrieveShows();
    }
    
    /**
     * Responds to the CDI event that's fired on the server when a {@link Booking} is created.
     * 
     * @param booking  the create booking
     */
    public void onNewBooking(@Observes @Created Booking booking) {
        updateBooking(booking, false);
    }
    
    /**
     * Responds to the CDI event that's fired on the server when a {@link Booking} is cancelled.
     * 
     * @param booking  the cancelled booking
     */
    public void onCancelledBooking(@Observes @Cancelled Booking booking) {
        updateBooking(booking, true);
    }
    
    // update the UI widget to reflect the new or cancelled booking
    private void updateBooking(Booking booking, boolean cancellation) {
        ShowStatusWidget sw = shows.get(booking.getPerformance().getShow());
        if (sw != null) {
            long count = getOccupiedCountForPerformance(booking.getPerformance());
            count += (cancellation) ? -booking.getTickets().size() : booking.getTickets().size();
              
            occupiedCounts.put(booking.getPerformance().getId(), count);
            sw.updatePerformance(booking.getPerformance());
        }
    }
    
    /**
     * Retrieve the sold ticket count for the given {@link Performance}.
     * 
     * @param p  the performance
     * @return number of sold tickets.
     */
    public static long getOccupiedCountForPerformance(Performance p) {
        Long count = occupiedCounts.get(p.getId());
        return (count == null) ? 0 : count.intValue();
    }
}
/*
 * Copyright 2011 JBoss, by Red Hat, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jboss.jdf.example.ticketmonster.monitor.client.shared;

import java.util.List;
import java.util.Map;

import org.jboss.errai.bus.server.annotations.Remote;
import org.jboss.jdf.example.ticketmonster.model.Show;

/**
 * A service used by the booking monitor for retrieving status information.
 * 
 * Errai's @Remote annotation indicates that the Service implementation can
 * be used as an RPC endpoint and that this interface can be used on the
 * client for type safe method invocation on this endpoint.
 * 
 * @author Christian Sadilek <csadilek@redhat.com>
 */
@Remote
public interface BookingMonitorService {
  
    /**
     * Lists all active {@link Show}s (shows with future performances). 
     * 
     * @return list of shows found.
     */
    public List<Show> retrieveShows();
    
    /**
     * Constructs a map of performance IDs to the total number of sold tickets.
     * 
     * @return map of performance IDs to the total number of sold tickets.
     */
    public Map<Long, Long> retrieveOccupiedCounts(); 
}

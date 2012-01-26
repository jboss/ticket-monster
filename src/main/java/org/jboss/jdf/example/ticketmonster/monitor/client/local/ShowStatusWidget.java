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

package org.jboss.jdf.example.ticketmonster.monitor.client.local;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.jboss.jdf.example.ticketmonster.model.Performance;
import org.jboss.jdf.example.ticketmonster.model.Show;

import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.VerticalPanel;

/**
 * A UI component to display the status of a {@link Show}.
 *
 * @author Christian Sadilek <csadilek@redhat.com>
 */
public class ShowStatusWidget extends Composite {

    private Map<Long, PerformanceStatusWidget> performances = new HashMap<Long, PerformanceStatusWidget>();

    public ShowStatusWidget(Show show) {
        VerticalPanel widgetPanel = new VerticalPanel();
        widgetPanel.setStyleName("show-status");

        Label showStatusHeader = new Label(show.getEvent().getName() + " @ " + show.getVenue());
        showStatusHeader.setStyleName("show-status-header");
        widgetPanel.add(showStatusHeader);

        // Add a performance status widget for each performance of the show
        for (Performance performance : show.getPerformances()) {
            if (performance.getDate().getTime() > new Date().getTime()) {
                PerformanceStatusWidget psw = new PerformanceStatusWidget(performance);
                performances.put(performance.getId(), psw);
                widgetPanel.add(psw);
            }
        }

        initWidget(widgetPanel);
    }

    /**
     * Triggers an update of the {@link PerformanceStatusWidget} associated with
     * the provided {@link Performance}.
     *
     * @param performance
     */
    public void updatePerformance(Performance performance) {
        PerformanceStatusWidget pw = performances.get(performance.getId());
        if (pw != null) {
            pw.updateBookingStatus();
        }
    }
}
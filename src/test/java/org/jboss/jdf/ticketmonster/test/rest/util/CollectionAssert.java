package org.jboss.jdf.ticketmonster.test.rest.util;

import java.util.Collection;

import org.junit.Assert;

public class CollectionAssert {

    public static void assertContains(Collection<?> expected, Collection<?> actual) {
        if (expected == null && actual == null)
            return;
        Assert.assertTrue("Expected " + expected + " but was " + actual, actual.containsAll(expected));
    }
    
}

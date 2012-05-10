package org.jboss.jdf.ticketmonster.test.rest.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.MultivaluedMap;

public class MockMultivaluedMap<K, V> extends ForwardingMap<K, List<V>> implements MultivaluedMap<K, V> {

    private Map<K, List<V>> map = new HashMap<K, List<V>>();
    
    @Override
    protected Map<K, List<V>> delegate() {
        return map;
    }
    
    @Override
    public void putSingle(K key, V value) {
        List<V> l = new ArrayList<V>(1);
        l.add(value);
        put(key, l);
    }

    @Override
    public void add(K key, V value) {
        List<V> l = get(key);
        if (l == null) {
            l = new ArrayList<V>(1);
            put(key, l);
        }
        l.add(value);
    }

    @Override
    public V getFirst(K key) {
        List<V> l = get(key);
        return l == null ? null : l.get(0);
    }



}
